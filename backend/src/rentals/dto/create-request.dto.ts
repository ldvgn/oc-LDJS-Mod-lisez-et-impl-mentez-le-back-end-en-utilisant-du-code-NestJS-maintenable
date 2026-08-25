import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  MaxLength,
} from 'class-validator';

export class CreateRentalDto {
  @ApiProperty({
    example: 'Appartement Paris',
    description: 'Nom de la location',
  })
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    example: 50,
    description: 'Surface en m²',
  })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Max(99999999.99)
  @IsNotEmpty()
  surface!: number;

  @ApiProperty({
    example: 1200,
    description: 'Loyer par mois',
  })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Max(99999999.99)
  @IsNotEmpty()
  price!: number;

  @ApiProperty({
    example: 'Bel appartement au coeur de Paris',
    description: 'Description de la location',
  })
  @IsString()
  @IsNotEmpty()
  description!: string;

  /*
   * La validation réelle du fichier (présence, type, taille) se fait via ParseFilePipeBuilder sur @UploadedFile() dans le contrôleur.
   * Ce champ n'existe que pour que Swagger UI affiche un champ d'upload de fichier sur cette route.
   */
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Image du logement (JPEG/PNG/WEBP)',
  })
  @IsOptional() // `forbidNonWhitelisted: true` dans main.ts fait que class-validator ne reconnaît une propriété comme "déclarée" que si elle porte au moins un décorateur class-validator
  picture!: string;
}
