import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';

@Module({
    imports: [
        JwtModule.register({
            global: true,
            secret: 'SECRET_KEY_example', // In prod, use env var
            signOptions: { expiresIn: '1d' },
        }),
    ],
    controllers: [AuthController],
})
export class AuthModule { }
