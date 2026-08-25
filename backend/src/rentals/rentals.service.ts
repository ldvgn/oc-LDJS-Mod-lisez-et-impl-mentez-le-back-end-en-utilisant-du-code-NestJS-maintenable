import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, rentals } from 'generated/prisma/client';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  RentalWithOwnerType,
  RentalWithUsersRelation,
} from './types/rentals.types';

@Injectable()
export class RentalsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly config: ConfigService,
  ) {}

  private toRentalWithOwner(
    rental: RentalWithUsersRelation,
  ): RentalWithOwnerType {
    const { users, surface, price, ...rest } = rental;
    return {
      ...rest,
      surface: Number(surface),
      price: Number(price),
      picture: `${this.config.get<string>('API_BASE_URL')}/uploads/${rest.picture}`,
      owner: users,
    };
  }

  /**
   * Liste toutes les locations avec leur propriétaire
   *
   * @returns Les locations avec users renommer en owner
   */
  async findAll(): Promise<RentalWithOwnerType[]> {
    const rentals = await this.prismaService.rentals.findMany({
      include: { users: { select: { id: true, name: true } } },
      omit: { owner_id: true },
    });
    return rentals.map((rental) => this.toRentalWithOwner(rental));
  }

  /**
   * Récupère une location par son id
   *
   * @param id Identifiant unique de la location
   * @returns La location
   * @throws {NotFoundException} Si la location est introuvable
   */
  async findOne(id: number): Promise<RentalWithOwnerType> {
    const rental = await this.prismaService.rentals.findUnique({
      where: { id },
      omit: { owner_id: true },
      include: { users: { select: { id: true, name: true } } },
    });

    if (!rental) throw new NotFoundException(`Location not found`);

    return this.toRentalWithOwner(rental);
  }

  /**
   * Crée une location en base
   *
   * @param data Données de la location
   * @returns La location créée
   */
  create(data: Prisma.rentalsUncheckedCreateInput): Promise<rentals> {
    return this.prismaService.rentals.create({ data });
  }

  /**
   * Met à jour une location si l'utilisateur authentifié en est le propriétaire
   *
   * @param id Identifiant unique de la location à mettre à jour
   * @param data Données de la location à mettre à jour
   * @param ownerId Identifiant de l'utilisateur authentifié
   * @returns La location mise à jour
   * @throws {NotFoundException} Si la location est introuvable
   * @throws {UnauthorizedException} Si l'utilisateur authentifié n'est pas le propriétaire de la location
   */
  async update(
    id: number,
    data: Prisma.rentalsUpdateInput,
    ownerId: number,
  ): Promise<rentals> {
    const rental = await this.prismaService.rentals.findUnique({
      where: { id },
    });

    if (!rental) throw new NotFoundException('Rental not found');
    if (rental.owner_id != ownerId)
      throw new UnauthorizedException(
        "Vous ne pouvez pas modifier la location d'un autre utilisateur",
      );

    if (data.picture && rental.picture && data.picture != rental.picture) {
      await unlink(join('./uploads', rental.picture)).catch(() => {});
    }
    if (!data.picture) {
      data.picture = rental.picture;
    }
    return this.prismaService.rentals.update({ where: { id }, data });
  }
}
