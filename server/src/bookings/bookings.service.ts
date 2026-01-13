import { Injectable, BadRequestException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { addMinutes, parseISO, format } from 'date-fns';
import { id } from 'date-fns/locale';

@Injectable()
export class BookingsService {
    constructor(
        private prisma: PrismaService,
        @InjectQueue('notifications') private notificationQueue: Queue
    ) { }

    async create(dto: CreateBookingDto) {
        // 1. Prepare Data
        // Frontend sends ISO string with +08:00 offset (e.g. 2024-01-20T10:00:00+08:00)
        // Prisma/Postgres stores as UTC.
        const startAt = parseISO(dto.bookingTime);

        const service = await this.prisma.service.findUnique({
            where: { id: dto.serviceId },
        });

        if (!service) {
            throw new BadRequestException('Layanan tidak valid');
        }

        const endAt = addMinutes(startAt, service.durationMin);

        // 2. Fetch Resources (Staff/Chairs)
        const resources = await this.prisma.resource.findMany();
        if (resources.length === 0) {
            throw new InternalServerErrorException('No resources available in system');
        }

        // 3. Loop through resources to find a slot (Concurrency Safe via DB Constraints)
        // We rely on the Exclusion Constraint on the DB to fail the transaction if overlap occurs.
        let booking;
        let lastError;

        for (const resource of resources) {
            try {
                booking = await this.prisma.$transaction(async (tx) => {
                    // A. Create Booking
                    const newBooking = await tx.booking.create({
                        data: {
                            customerName: dto.customerName,
                            customerEmail: dto.customerEmail,
                            customerPhone: dto.customerPhone,
                            serviceId: dto.serviceId,
                            resourceId: resource.id,
                            startAt: startAt,
                            endAt: endAt,
                            durationMin: service.durationMin,
                            notes: dto.notes,
                            status: 'PENDING',
                        },
                    });

                    // B. Formatted Messages
                    const dateFormatted = format(startAt, 'EEEE, d MMMM yyyy', { locale: id });
                    const timeFormatted = format(startAt, 'HH:mm', { locale: id });

                    const waMessage = `✨ *Konfirmasi Reservasi Rahayu Salon* ✨\n\n🆔 Kode Booking: *#${newBooking.id}*\n\nHalo Kak *${dto.customerName}*,\n\nTerima kasih telah memilih kami. Reservasi eksklusif Anda telah terkonfirmasi:\n\n📅 *${dateFormatted}*\n⏰ *${timeFormatted} WITA*\n💅 *${service.name}*\n📍 *Rahayu Salon, Denpasar*\n\nKami menantikan kedatangan Kakak untuk pengalaman perawatan terbaik. Mohon hadir 10 menit lebih awal agar sesi perawatan maksimal.\n\nSalam hangat,\n*Tim Rahayu Salon* 🌸`;

                    const gcalDescription = `✨ Reservasi Eksklusif: ${service.name}\n\n👤 Pelanggan: ${dto.customerName}\n📱 Kontak: ${dto.customerPhone}\n⏳ Durasi: ${service.durationMin} menit\n📝 Catatan: ${dto.notes || '-'}\n\nKami menantikan kedatangan Anda di Rahayu Salon.`;

                    // C. Create Outbox - WhatsApp
                    await tx.notificationOutbox.create({
                        data: {
                            bookingId: newBooking.id,
                            channel: 'WHATSAPP',
                            payload: {
                                target: dto.customerPhone,
                                message: waMessage
                            }
                        }
                    });

                    // D. Create Outbox - Google Calendar
                    await tx.notificationOutbox.create({
                        data: {
                            bookingId: newBooking.id,
                            channel: 'GCAL',
                            payload: {
                                summary: `[Rahayu] ${service.name} - ${dto.customerName}`,
                                description: gcalDescription,
                                start: startAt.toISOString(),
                                end: endAt.toISOString(),
                                attendees: [dto.customerEmail],
                                location: 'Rahayu Salon, Denpasar, Bali'
                            }
                        }
                    });

                    return newBooking;
                });

                // If we get here, transaction succeeded (no overlap)
                break;

            } catch (error: any) {
                // Check for P2002 (Unique constraint) or P0001 (Exclusion constraint violation)
                // Prisma often throws P2002 for exclusions too depending on driver
                // But specifically we look for code '23P01' (exclusion_violation) in raw error if available,
                // or just catch simplistic DB errors.
                // For MVP, if it fails, we assume it's an overlap and try next resource.
                lastError = error;
                continue;
            }
        }

        if (!booking) {
            // All resources busy
            console.error('Booking failed:', lastError);
            throw new ConflictException('Mohon maaf, slot waktu penuh untuk jam tersebut. Silahkan pilih jam lain.');
        }

        // 4. Dispatch Job to Queue (After Transaction Commit)
        if (booking) {
            await this.notificationQueue.add('new_booking', {
                bookingId: booking.id
            });
        }

        return booking;
    }

    async findAll(start?: string, end?: string) {
        return this.prisma.booking.findMany({
            where: {
                status: { not: 'CANCELLED' }
            },
            orderBy: {
                startAt: 'desc'
            },
            include: {
                service: true,
                resource: true
            }
        });
    }
}
