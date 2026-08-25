import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RentalsModule } from './rentals/rentals.module';
import { MessagesModule } from './messages/messages.module';
@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    RentalsModule,
    MessagesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
