import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

import helmet from 'helmet';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Security Headers
    app.use(helmet());

    // Strict CORS
    app.enableCors({
        origin: process.env.CLIENT_URL || 'http://localhost:3000',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });

    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));

    const port = process.env.PORT || 5000;
    await app.listen(port);
    console.log(`Server running on port ${port}`);
}
bootstrap();
