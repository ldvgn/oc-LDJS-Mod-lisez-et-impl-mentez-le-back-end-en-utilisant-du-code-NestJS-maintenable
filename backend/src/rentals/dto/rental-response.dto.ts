import { ApiProperty, PickType } from '@nestjs/swagger';
import { UserResponseDto } from 'src/users/dto/user-response.dto';

export class OwnerSummary extends PickType(UserResponseDto, ['id', 'name']) {}

export class RentalResponseDto {
  @ApiProperty({
    example: 1,
    description: "Identifiant unique de l'annonce de location",
  })
  id!: number;

  @ApiProperty({
    example: 'Appartement Paris',
    description: "Nom de l'annonce de la location",
  })
  name!: string;

  @ApiProperty({
    example: 'http://localhost:3001/uploads/<nom-du-fichier>',
    description: 'Image du logement',
  })
  picture!: string;

  @ApiProperty({
    example: 'Notre appartement est un bien idéalement situé.',
    description: 'Description du logement',
  })
  description!: string;

  @ApiProperty({
    example: '2026-08-19T14:32:00.000Z',
    description: "Date de création de l'annonce de la location",
  })
  created_at!: Date;

  @ApiProperty({
    example: '2026-08-19T14:32:00.000Z',
    description:
      "Date de dernière modification de l'annonce de la location  (identique à created_at tant qu'aucune modification n'a eu lieu)",
  })
  updated_at!: Date;

  @ApiProperty({
    example: 15,
    description: 'Surface habitable du logement',
  })
  surface!: number;

  @ApiProperty({
    example: 600,
    description: 'Prix du logement par mois',
  })
  price!: number;

  @ApiProperty({ type: OwnerSummary })
  owner!: OwnerSummary;
}
