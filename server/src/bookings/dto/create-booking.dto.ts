import { IsString, IsEmail, IsNotEmpty, IsDateString, IsOptional } from 'class-validator';

export class CreateBookingDto {
    @IsString()
    @IsNotEmpty()
    customerName: string;

    @IsEmail()
    @IsNotEmpty()
    customerEmail: string;

    @IsString()
    @IsNotEmpty()
    customerPhone: string;

    @IsString()
    @IsNotEmpty()
    serviceId: string;

    @IsDateString() // ISO 8601
    bookingTime: string;

    @IsString()
    @IsOptional()
    notes?: string;
}
