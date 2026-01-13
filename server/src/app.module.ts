import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { BookingsModule } from './bookings/bookings.module';
import { ServicesModule } from './services/services.module';
import { QueueModule } from './queue/queue.module';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        ThrottlerModule.forRoot([{
            ttl: 60000,
            limit: 10, // 10 requests per minute per IP
        }]),
        PrismaModule,
        BookingsModule,
        ServicesModule,
        QueueModule,
        AuthModule,
    ],
    controllers: [],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
})
export class AppModule { }
