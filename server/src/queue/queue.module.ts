import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { NotificationsProcessor } from './notifications.processor';

@Module({
    imports: [
        BullModule.forRoot({
            redis: {
                host: process.env.REDIS_HOST || 'localhost',
                port: parseInt(process.env.REDIS_PORT || '6379'),
            },
        }),
        BullModule.registerQueue({
            name: 'notifications',
        }),
    ],
    providers: [NotificationsProcessor],
    exports: [BullModule],
})
export class QueueModule { }
