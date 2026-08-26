import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({
    example: 1,
    description: 'Identifiant de la location concernée',
  })
  @IsInt()
  @IsNotEmpty()
  rental_id!: number;

  @ApiProperty({
    example: 1,
    description: "Identifiant de l'utilisateur envoyant le message",
  })
  @IsInt()
  @IsNotEmpty()
  user_id!: number;

  @ApiProperty({
    example: 'Bonjour, ce logement est-il toujours disponible ?',
    description: 'Contenu du message',
  })
  @IsString()
  @IsNotEmpty()
  message!: string;
}
