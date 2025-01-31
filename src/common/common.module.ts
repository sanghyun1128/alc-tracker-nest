import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as multer from 'multer';
import { extname } from 'path';
import { v4 as uuidV4 } from 'uuid';

import { CommonController } from './common.controller';
import { CommonService } from './common.service';
import { TEMP_FOLDER_PATH } from './const/path.const';
import { ImageModel } from './entity/image.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([ImageModel]),
    AuthModule,
    UsersModule,
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
          cb(null, TEMP_FOLDER_PATH);
        },
        filename: function (req, file, cb) {
          const date = new Date();
          const day = String(date.getDate()).padStart(2, '0');
          const hour = String(date.getHours()).padStart(2, '0');

          cb(null, `${day}${hour}-${uuidV4()}${extname(file.originalname)}`);
        },
      }),
    }),
  ],
  controllers: [CommonController],
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}
