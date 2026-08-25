import { Module } from '@nestjs/common';
import { RentalsService } from './rentals.service';
import { MulterModule } from '@nestjs/platform-express';
import { RentalsController } from './rentals.controller';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, callback) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 2 * 1024 * 1024 },
    }),
  ],
  providers: [RentalsService],
  controllers: [RentalsController],
})
export class RentalsModule {}
