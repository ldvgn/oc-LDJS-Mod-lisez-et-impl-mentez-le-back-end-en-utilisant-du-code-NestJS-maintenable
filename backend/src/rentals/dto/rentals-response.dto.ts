import { ApiProperty } from '@nestjs/swagger';
import { RentalResponseDto } from './rental-response.dto';

export class RentalsResponseDto {
  @ApiProperty({ type: [RentalResponseDto] })
  rentals!: RentalResponseDto[];
}
