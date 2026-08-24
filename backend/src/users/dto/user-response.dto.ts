import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    example: 1,
    description: "Identifiant unique de l'utilisateur",
  })
  id!: number;

  @ApiProperty({
    example: 'user@example.com',
    description: "Email de l'utilisateur",
  })
  email!: string;

  @ApiProperty({ example: 'John Doe', description: "Nom de l'utilisateur" })
  name!: string;

  @ApiProperty({
    example: '2026-08-24T10:56:45.000Z',
    description: 'Date de création du compte (ISO 8601, UTC)',
  })
  created_at!: Date;

  @ApiProperty({
    example: '2026-08-24T10:56:45.000Z',
    description: 'Date de dernière modification du compte (ISO 8601, UTC)',
  })
  updated_at!: Date;
}
