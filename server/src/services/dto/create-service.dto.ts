import { IsString, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateServiceDto {
    @IsString()
    @IsNotEmpty()
    id: string; // e.g., 'Manicure'

    @IsString()
    @IsNotEmpty()
    name: string; // e.g., 'Manicure Basics'

    @IsNumber()
    @IsPositive()
    durationMin: number;

    @IsNumber()
    @IsPositive()
    price: number;
}
