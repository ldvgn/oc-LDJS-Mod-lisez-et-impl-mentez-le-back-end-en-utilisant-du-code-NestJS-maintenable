import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageResponseDto } from './dto/message-response.dto';
import type { Request } from 'express';

@ApiTags('messages')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  /**
   * Crée un nouveau message associé à l'utilisateur authentifié et à une location
   *
   * @param body Données du message à créer
   * @param req Requête HTTP dont `req.user` est peuplé par `JwtStrategy.validate()`
   * @returns Un message de confirmation
   * @throws {NotFoundException} Si la location visée par le message est introuvable
   * @throws {UnauthorizedException} Si le token est absent, invalide, expiré, ou si l'utilisateur correspondant n'existe plus en base
   */
  @ApiOperation({
    summary: 'Crée un nouveau message',
    description:
      "Crée un nouveau message associée à l'utilisateur authentifié et à une location spécifique",
  })
  @ApiBody({ type: CreateMessageDto })
  @ApiCreatedResponse({
    description: 'Message envoyé avec succès',
    type: MessageResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Utilisateur non authentifié' })
  @Post()
  async create(@Body() body: CreateMessageDto, @Req() req: Request) {
    const data = {
      ...body,
      user_id: (req.user as { id: number }).id,
    };

    await this.messagesService.create(data);

    return { message: 'Message sent!' };
  }
}
