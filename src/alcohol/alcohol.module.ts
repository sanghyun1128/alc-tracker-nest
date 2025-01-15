import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as multer from 'multer';
import { extname } from 'path';
import { v4 as uuidV4 } from 'uuid';

import { AlcoholController } from './alcohol.controller';
import { AlcoholService } from './alcohol.service';
import { CocktailModel, SpiritModel, WineModel } from './entities/alcohol.entity';
import { AuthModule } from 'src/auth/auth.module';
import { CommonModule } from 'src/common/common.module';
import { ALCOHOLS_IMAGES_FOLDER_PATH } from 'src/common/const/path.const';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SpiritModel, WineModel, CocktailModel]),
    AuthModule,
    UsersModule,
    CommonModule,
    MulterModule.register({
      limits: {
        fileSize: 1024 * 1024 * 10, // 10MB
      },
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname);

        if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
          return cb(new Error('Only jpg, jpeg and png is allowed'), false);
        }

        return cb(null, true);
      },
      storage: multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, ALCOHOLS_IMAGES_FOLDER_PATH);
        },
        filename: function (req, file, cb) {
          const date = new Date();
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');

          cb(null, `${year}${month}${day}-${uuidV4()}${extname(file.originalname)}`);
        },
      }),
    }),
  ],
  controllers: [AlcoholController],
  providers: [AlcoholService],
})
export class AlcoholModule {}
