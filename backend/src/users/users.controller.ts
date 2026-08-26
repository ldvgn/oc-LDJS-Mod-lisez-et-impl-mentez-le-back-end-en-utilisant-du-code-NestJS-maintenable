import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { UsersService } from './users.service';
import { UserResponseDto } from './dto/user-response.dto';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Retourne les informations d'un utilisateur donné
   *
   * @param id Identifiant unique de l'utilisateur
   * @returns L'utilisateur demandé
   * @throws {NotFoundException} Si l'utilisateur est inconnu
   * @throws {UnauthorizedException} Si le token est absent, invalide, expiré, ou si l'utilisateur correspondant n'existe plus en base
   */
  @ApiOperation({
    summary: "Affiche les informations d'un utilisateur",
    description:
      "Retourne les informations détaillées de l'utilisateur correspondant à l'identifiant fourni",
  })
  @ApiOkResponse({
    description: "Retourne l'utilisateur demandé",
    type: UserResponseDto,
  })
  @ApiNotFoundResponse({ description: "l'utilisateur demandé est inconnu" })
  @ApiUnauthorizedResponse({ description: 'Utilisateur non authentifié' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }
}
