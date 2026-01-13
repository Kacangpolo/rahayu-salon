import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { GoogleCalendarService } from './calendar/google-calendar.service';
import { WhatsAppService } from './whatsapp/whatsapp.service';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        PrismaModule,
    ],
    providers: [GoogleCalendarService, WhatsAppService],
})
class WorkerModule { }

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(WorkerModule);
    const prisma = app.get(PrismaService);
    const gcal = app.get(GoogleCalendarService);
    const wa = app.get(WhatsAppService);

    console.log('Worker started. Polling for Outbox events...');

    const poll = async () => {
        try {
            await prisma.$transaction(async (tx) => {
                // 0. Reaper: Reset stuck PROCESSING jobs (older than 5 mins)
                await tx.$executeRaw`
                UPDATE "NotificationOutbox"
                SET status = 'PENDING'::"OutboxStatus", "retryCount" = "retryCount" + 1, "lastError" = 'Stuck in PROCESSING (Reaper)', "processedAt" = NULL
                WHERE status = 'PROCESSING'::"OutboxStatus" AND "processedAt" < NOW() - INTERVAL '5 minutes'
            `;

                // 1. Fetch NEXT pending items with SKIP LOCKED
                const pending = await tx.$queryRaw`
                SELECT * FROM "NotificationOutbox"
                WHERE status = 'PENDING'::"OutboxStatus"
                AND ("nextAttemptAt" IS NULL OR "nextAttemptAt" <= NOW())
                AND "retryCount" < "maxRetries"
                ORDER BY "createdAt" ASC
                LIMIT 5
                FOR UPDATE SKIP LOCKED
             `;

                const items = pending as any[];
                if (items.length > 0) {
                    console.log(`Processing ${items.length} outbox items...`);
                    for (const item of items) {
                        await tx.notificationOutbox.update({
                            where: { id: item.id },
                            data: { status: 'PROCESSING', processedAt: new Date() }
                        });
                    }
                }
            });

            // 2. Process Items (We own these now, status=PROCESSING)
            const processingItems = await prisma.notificationOutbox.findMany({
                where: { status: 'PROCESSING' }
            });

            for (const item of processingItems) {
                try {
                    const payload = item.payload as any;

                    if (item.channel === 'GCAL') {
                        // Check if Booking already has googleEventId (Idempotency)
                        const booking = await prisma.booking.findUnique({ where: { id: item.bookingId } });

                        if (booking.googleEventId) {
                            console.log(`Booking ${item.bookingId} already has Event ID. Skipping creation.`);
                        } else {
                            const event = await gcal.createEvent(payload);
                            await prisma.booking.update({
                                where: { id: item.bookingId },
                                data: { googleEventId: event.id }
                            });
                        }

                    } else if (item.channel === 'WHATSAPP') {
                        await wa.sendMessage(payload.target, payload.message);
                    }

                    await prisma.notificationOutbox.update({
                        where: { id: item.id },
                        data: { status: 'SENT', processedAt: new Date() }
                    });

                } catch (err: any) {
                    console.error(`Failed job ${item.id}:`, err.message);

                    // Backoff: 1m, 2m, 4m...
                    const backoffMinutes = Math.pow(2, item.retryCount || 0);
                    const nextAttempt = new Date(Date.now() + backoffMinutes * 60000);

                    await prisma.notificationOutbox.update({
                        where: { id: item.id },
                        data: {
                            status: 'PENDING', // Re-queue
                            lastError: err.message,
                            retryCount: { increment: 1 },
                            nextAttemptAt: nextAttempt,
                            processedAt: null
                        }
                    });
                }
            }

        } catch (e) {
            console.error('Worker polling error:', e);
        }

        setTimeout(poll, 2000);
    };

    poll();
}

bootstrap();
