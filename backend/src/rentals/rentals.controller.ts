import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { RentalsService } from './rentals.service';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RentalsResponseDto } from './dto/rentals-response.dto';
import { RentalResponseDto } from './dto/rental-response.dto';

@ApiTags('rentals')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('rentals')
export class RentalsController {
  constructor(private readonly rentalsService: RentalsService) {}

  /**
   * Retourne la liste toutes les locations
   *
   * @returns La liste de toutes les locations
   * @throws {UnauthorizedException} Si le token est absent, invalide, expiré, ou si l'utilisateur correspondant n'existe plus en base
   */
  @ApiOperation({
    summary: 'Lister toutes les locations',
    description: 'Retourne la liste de toutes les locations disponibles.',
  })
  @ApiOkResponse({
    description: 'Retourne la liste de toutes les locations',
    type: RentalsResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Utilisateur non authentifié' })
  @Get()
  async findAll() {
    return { rentals: await this.rentalsService.findAll() };
  }

  /**
   * Retourne les informations d'une location donnée
   *
   * @param id Identifiant unique de la location
   * @returns La location
   * @throws {NotFoundException} Si la location est inconnue
   * @throws {UnauthorizedException} Si le token est absent, invalide, expiré, ou si l'utilisateur correspondant n'existe plus en base
   */
  @ApiOperation({
    summary: "Afficher les informations d'une location",
    description:
      "Retourne les informations détaillées de la location correspondant à l'identifiant fourni.",
  })
  @ApiOkResponse({
    description: 'Retourne la location demandée',
    type: RentalResponseDto,
  })
  @ApiNotFoundResponse({ description: 'La location demandée est inconnue' })
  @ApiUnauthorizedResponse({ description: 'Utilisateur non authentifié' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rentalsService.findOne(id);
  }
}
