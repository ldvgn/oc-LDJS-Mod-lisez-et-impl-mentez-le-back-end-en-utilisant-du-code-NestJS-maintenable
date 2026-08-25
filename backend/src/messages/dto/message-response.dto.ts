import { ApiProperty } from '@nestjs/swagger';

export class MessageResponseDto {
  @ApiProperty({
    example: 'Message sent!',
    description: 'Message de confirmation',
  })
  message!: string;
}
