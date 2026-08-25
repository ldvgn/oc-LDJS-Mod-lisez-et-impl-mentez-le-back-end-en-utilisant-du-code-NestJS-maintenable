import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, messages } from 'generated/prisma/client';

@Injectable()
export class MessagesService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Crée un message en base
   *
   * @param data Données du message
   * @returns Le message créé
   * @throws {NotFoundException} Si la location visée par le message est introuvable
   */
  async create(data: Prisma.messagesUncheckedCreateInput): Promise<messages> {
    const rental = await this.prismaService.rentals.findUnique({
      where: { id: data.rental_id },
    });

    if (!rental) throw new NotFoundException('Rental not found');

    return this.prismaService.messages.create({ data });
  }
}
