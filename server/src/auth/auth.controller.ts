import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
    constructor(private jwtService: JwtService) { }

    @Post('login')
    async login(@Body() body: any) {
        // Hardcoded admin for MVP
        if (body.email === 'admin@rahayu.com' && body.password === 'admin123') {
            return {
                access_token: this.jwtService.sign({ email: body.email, sub: 'admin' }),
            };
        }
        throw new UnauthorizedException();
    }
}
