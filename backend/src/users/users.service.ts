import { Injectable } from '@nestjs/common';
import { Prisma, users } from 'generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Recherche un utilisateur par email
   *
   * @param email Adresse email de l'utilisateur recherché
   * @returns L'utilisateur, ou `null` si introuvable
   */
  findUniqueByEmail(email: string): Promise<users | null> {
    return this.prismaService.users.findUnique({ where: { email } });
  }

  /**
   * Crée un nouvel utilisateur
   *
   * @param data Données de l'utilisateur à créer
   * @returns L'utilisateur créé
   */
  create(data: Prisma.usersCreateInput): Promise<users> {
    return this.prismaService.users.create({ data });
  }

  /**
   * Recherche un utilisateur par son id
   *
   * @param id Identifiant de l'utilisateur recherché
   * @returns L'utilisateur (sans le champ `password`), ou `null` si introuvable
   */
  findUniqueById(id: number): Promise<Omit<users, 'password'> | null> {
    return this.prismaService.users.findUnique({
      where: { id },
      omit: { password: true },
    });
  }
}
