import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';

@Injectable()
export class ServicesService {
    constructor(private prisma: PrismaService) { }

    create(dto: CreateServiceDto) {
        return this.prisma.service.create({ data: dto });
    }

    findAll() {
        return this.prisma.service.findMany();
    }

    findOne(id: string) {
        return this.prisma.service.findUnique({ where: { id } });
    }
}
