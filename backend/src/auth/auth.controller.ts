import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/login-request.dto';
import { RegisterRequestDto } from './dto/register-request.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtGuard } from './guards/jwt.guard';
import { TokenResponseDto } from './dto/token-response.dto';
import { UserResponseDto } from 'src/users/dto/user-response.dto';
import type { Request } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Authentifie un utilisateur et retourne un objet contenant le token JWT
   *
   * @param body Email et mot de passe fournis dans le corps de la requête
   * @returns Un objet contenant le token JWT
   * @throws {UnauthorizedException} Si l'email est inconnu ou le mot de passe incorrect
   */
  @ApiOperation({
    summary: 'Authentifie un utilisateur',
    description:
      "Vérifie l'email et le mot de passe fournis, puis retourne un token JWT à transmettre dans le header `Authorization: Bearer <token>` pour accéder aux routes protégées (ex. `GET /auth/me`).",
  })
  @ApiOkResponse({
    description: 'Connexion réussie, retourne un objet contenant le token JWT',
    type: TokenResponseDto,
  })
  @ApiBadRequestResponse({
    description:
      'Corps de requête invalide (email ou mot de passe manquant/mal formé)',
  })
  @ApiUnauthorizedResponse({
    description: 'Email inconnu ou mot de passe incorrect',
  })
  @Post('login')
  async login(@Body() body: LoginRequestDto): Promise<TokenResponseDto> {
    return {
      token: await this.authService.login(body.email, body.password),
    };
  }

  /**
   * Enregistre un nouvel utilisateur et retourne un objet contenant le token JWT
   *
   * @param body Email, nom, mot de passe fournis par le corps de la requête
   * @returns Un objet contenant le token JWT
   * @throws {ConflictException} Si un utilisateur existe déjà avec cet email
   */
  @ApiOperation({
    summary: 'Enregistre un nouvel utilisateur',
    description:
      "Crée un compte avec l'email, le nom et le mot de passe fournis (mot de passe haché avant stockage), puis connecte automatiquement l'utilisateur en retournant un token JWT.",
  })
  @ApiCreatedResponse({
    description: 'Utilisateur créé, retourne un objet contenant le token JWT',
    type: TokenResponseDto,
  })
  @ApiBadRequestResponse({
    description:
      'Corps de requête invalide (champ manquant ou mot de passe trop court)',
  })
  @ApiConflictResponse({ description: 'Un compte existe déjà avec cet email' })
  @Post('register')
  async register(@Body() body: RegisterRequestDto): Promise<TokenResponseDto> {
    return {
      token: await this.authService.register(
        body.email,
        body.name,
        body.password,
      ),
    };
  }

  /**
   * Retourne les informations de l'utilisateur actuellement authentifié
   *
   * @param req Requête HTTP dont `req.user` est peuplé par `JwtStrategy.validate()`
   * @returns Les informations de l'utilisateur courant (sans le mot de passe)
   * @throws {UnauthorizedException} Si le token est absent, invalide, expiré, ou si l'utilisateur correspondant n'existe plus en base
   */
  @ApiOperation({
    summary: "Retourne les informations de l'utilisateur authentifié",
    description:
      "Vérifie le token fourni via le header Authorization, puis retourne les informations de l'utilisateur connecté.",
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: "Retourne l'utilisateur courant",
    type: UserResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Utilisateur non authentifié' })
  @UseGuards(JwtGuard)
  @Get('me')
  me(@Req() req: Request) {
    return req.user;
  }
}
