import { rentals, users } from 'generated/prisma/client';

export type RentalWithOwnerType = Omit<
  rentals,
  'owner_id' | 'surface' | 'price'
> & {
  surface: number;
  price: number;
  owner: Pick<users, 'id' | 'name'>;
};

export type RentalWithUsersRelation = Omit<rentals, 'owner_id'> & {
  users: Pick<users, 'id' | 'name'>;
};
