import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { PrismaService } from '../prisma/prisma.service';

@Processor('notifications')
export class NotificationsProcessor {
    constructor(private readonly prisma: PrismaService) { }

    @Process('new_booking')
    async handleNewBooking(job: Job<{ bookingId: string }>) {
        console.log(`Processing booking ${job.data.bookingId}...`);

        // 1. Fetch Request
        const booking = await this.prisma.booking.findUnique({
            where: { id: job.data.bookingId },
            include: { service: true },
        });

        if (!booking) return;

        // 2. Mock Google Calendar Call
        // Idempotency check
        if (!booking.googleEventId) {
            console.log(`[Google Calendar] Creating event for ${booking.customerEmail}`);
            // MOCK API REQUEST...
            const mockEventId = `ev_${Date.now()}`;

            await this.prisma.booking.update({
                where: { id: booking.id },
                data: { googleEventId: mockEventId },
            });
        }

        // 3. Mock WhatsApp Call
        if (!booking.waMessageId) {
            console.log(`[WhatsApp] Sending confirmation to ${booking.customerPhone}`);
            // MOCK API REQUEST...
            const mockWaId = `wa_${Date.now()}`;

            await this.prisma.booking.update({
                where: { id: booking.id },
                data: {
                    waMessageId: mockWaId,
                    waStatus: 'SENT'
                },
            });
        }

        console.log('Job finished.');
    }
}
