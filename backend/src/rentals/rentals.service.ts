import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  RentalWithOwnerType,
  RentalWithUsersRelation,
} from './types/rentals.types';

@Injectable()
export class RentalsService {
  constructor(private readonly prismaService: PrismaService) {}

  private toRentalWithOwner(
    rental: RentalWithUsersRelation,
  ): RentalWithOwnerType {
    const { users, surface, price, ...rest } = rental;
    return {
      ...rest,
      surface: Number(surface),
      price: Number(price),
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
   * @param id L'identifiant unique de la location
   * @returns La location
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
}
