import { uploadConst } from '@/constants';
import { HttpException } from '@/exceptions/HttpException';
import { IFileUploaded, IUploadFile, UploadExtType } from '@/interfaces/upload.interface';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { logger } from '@/utils/logger';
import { HOST_UPLOAD } from '@/config';
import { Request } from 'express';

export const uploadMiddleware = (
  options: IUploadFile = {
    allowedExtType: UploadExtType.IMAGE,
    maxCount: uploadConst.MAX_COUNT,
    maxSize: uploadConst.MAX_SIZE,
    savePath: uploadConst.SAVE_PLACES.ROOT,
  },
) =>
  multer({
    storage: multer.diskStorage({
      destination(req: Request, file: Express.Multer.File, callback: (error: Error | null, destination: string) => void) {
        if (!fs.existsSync(uploadConst.SAVE_PLACES.ROOT)) {
          fs.mkdirSync(uploadConst.SAVE_PLACES.ROOT);
        }

        if (file.mimetype.includes(uploadConst.TYPE.IMAGE)) {
          if (!fs.existsSync(uploadConst.SAVE_PLACES.IMAGE)) {
            fs.mkdirSync(uploadConst.SAVE_PLACES.IMAGE);
          }

          return callback(null, uploadConst.SAVE_PLACES.IMAGE);
        }

        if (file.mimetype.includes(uploadConst.TYPE.VIDEO)) {
          if (!fs.existsSync(uploadConst.SAVE_PLACES.VIDEO)) {
            fs.mkdirSync(uploadConst.SAVE_PLACES.VIDEO);
          }

          return callback(null, uploadConst.SAVE_PLACES.VIDEO);
        }

        if (!fs.existsSync(uploadConst.SAVE_PLACES.OTHER)) {
          fs.mkdirSync(uploadConst.SAVE_PLACES.OTHER);
        }

        return callback(null, uploadConst.SAVE_PLACES.OTHER);
      },

      filename(req: Request, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void) {
        const extensionFile = path.extname(file.originalname.toLowerCase());
        // const fileName = file.originalname.split(extensionFile)[0].replace(/\s+/g, '-');
        // console.log('===> filename: ', fileName);
        const uniqueFileName = `${Date.now()}${extensionFile}`; // ${fileName}_
        console.log('===> filename with uniqueFileName: ', uniqueFileName);

        callback(null, uniqueFileName);
      },
    }),

    fileFilter(req: Request, file: Express.Multer.File, callback: multer.FileFilterCallback) {
      const extensionFile = path.extname(file.originalname.toLowerCase()).replace('.', '');

      const allowedExts = uploadConst.EXTENSIONS[options.allowedExtType.toUpperCase()];

      if (!allowedExts.includes(extensionFile)) {
        return callback(new HttpException(400, `Only images, videos and documents are allowed. File extension supported: ${allowedExts.join(', ')}`));
      }

      return callback(null, true);
    },

    dest: options.savePath || uploadConst.SAVE_PLACES.ROOT,
    limits: {
      fileSize: options.maxSize || uploadConst.MAX_SIZE,
      files: options.maxCount || uploadConst.MAX_COUNT,
    },
  });

export default uploadMiddleware;
