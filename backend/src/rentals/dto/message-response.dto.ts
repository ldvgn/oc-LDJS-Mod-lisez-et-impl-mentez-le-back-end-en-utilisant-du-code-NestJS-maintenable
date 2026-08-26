import { ApiProperty } from '@nestjs/swagger';

export class MessageResponseDto {
  @ApiProperty({
    example: 'Rental created!',
    description: 'Message de confirmation',
  })
  message!: string;
}
