import {
  Body,
  Controller,
  Get,
  Param,
  ParseFilePipeBuilder,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RentalsService } from './rentals.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiPayloadTooLargeResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RentalsResponseDto } from './dto/rentals-response.dto';
import { RentalResponseDto } from './dto/rental-response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateRentalDto } from './dto/create-request.dto';
import type { Request } from 'express';
import { MessageResponseDto } from './dto/message-response.dto';
import { UpdateRentalDto } from './dto/update-request.dto';

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

  /**
   * Crée une nouvelle location
   *
   * @param body Données de la location à créer
   * @param file Image de la location (JPEG/PNG/WEBP, 2 Mo max)
   * @param req Requête HTTP dont `req.user` est peuplé par `JwtStrategy.validate()`
   * @returns Un message de confirmation
   * @throws {BadRequestException} Si le corps de la requête ou le type de la photo est invalide
   * @throws {PayloadTooLargeException} Si la photo dépasse la taille maximale autorisée
   * @throws {UnauthorizedException} Si le token est absent, invalide, expiré, ou si l'utilisateur correspondant n'existe plus en base
   */
  @ApiOperation({
    summary: 'Crée une nouvelle location',
    description:
      "Crée une nouvelle location associée à l'utilisateur authentifié, avec upload d'une photo.",
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateRentalDto })
  @ApiCreatedResponse({
    description: 'Location créée avec succès',
    type: MessageResponseDto,
  })
  @ApiPayloadTooLargeResponse({
    description: 'Fichier trop volumineux (max: 2Mo)',
  })
  @ApiBadRequestResponse({
    description: 'Corps de requête invalide ou type de photo invalide',
  })
  @ApiUnauthorizedResponse({ description: 'Utilisateur non authentifié' })
  @Post()
  @UseInterceptors(FileInterceptor('picture'))
  async create(
    @Body() body: CreateRentalDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpeg|jpg|png|webp)$/,
          fallbackToMimetype: true,
        })
        .build(),
    )
    file: Express.Multer.File,
    @Req() req: Request,
  ) {
    const { picture: _picture, ...rest } = body;
    const data = {
      ...rest,
      picture: file.filename,
      owner_id: (req.user as { id: number }).id,
    };
    await this.rentalsService.create(data);
    return { message: 'Rental created!' };
  }

  /**
   * Met à jour une location si l'utilisateur authentifié en est le propriétaire
   *
   * @param id Identifiant unique de la location à mettre à jour
   * @param body Champs de la location à modifier
   * @param file Nouvelle photo du logement (JPEG/PNG/WEBP, 2 Mo max) ; si absente, la photo existante (`body.picture`) est conservée
   * @param req Requête HTTP dont `req.user` est peuplé par `JwtStrategy.validate()`
   * @returns Un message de confirmation
   * @throws {BadRequestException} Si le corps de la requête ou le type de la photo est invalide
   * @throws {PayloadTooLargeException} Si la photo dépasse la taille maximale autorisée
   * @throws {NotFoundException} Si la location est inconnue
   * @throws {UnauthorizedException} Si le token est absent, invalide, expiré, si l'utilisateur correspondant n'existe plus en base, ou s'il n'est pas le propriétaire de la location
   */
  @ApiOperation({
    summary: 'Met à jour une location',
    description:
      "Met à jour les informations d'une location existante, avec upload optionnel d'une nouvelle photo. Seul le propriétaire de la location peut la modifier.",
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateRentalDto })
  @ApiOkResponse({
    description: 'Location modifiée avec succès',
    type: MessageResponseDto,
  })
  @ApiPayloadTooLargeResponse({
    description: 'Fichier trop volumineux (max: 2Mo)',
  })
  @ApiBadRequestResponse({
    description: 'Corps de requête invalide ou type de photo invalide',
  })
  @ApiNotFoundResponse({ description: 'La location demandée est inconnue' })
  @ApiUnauthorizedResponse({ description: 'Utilisateur non authentifié' })
  @Put(':id')
  @UseInterceptors(FileInterceptor('picture'))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateRentalDto,
    @Req() req: Request,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpeg|jpg|png|webp)$/,
          fallbackToMimetype: true,
        })
        .build({ fileIsRequired: false }),
    )
    file?: Express.Multer.File,
  ) {
    const data = {
      ...body,
      picture: file ? file.filename : null,
    };

    await this.rentalsService.update(id, data, (req.user as { id: number }).id);

    return { message: 'Rental updated!' };
  }
}
