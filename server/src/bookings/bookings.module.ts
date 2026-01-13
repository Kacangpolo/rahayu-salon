import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { QueueModule } from '../queue/queue.module';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';

@Module({
    imports: [PrismaModule, QueueModule],
    controllers: [BookingsController],
    providers: [BookingsService],
    exports: [BookingsService],
})
export class BookingsModule { }
