import { ApartsPictures } from '../models/ApartsPictures';
import fs from 'fs';
import path from 'path';
import { NextFunction, Request, Response } from 'express';
import { BadRequestError, NotFoundError } from '../errors/ApiError';
import { JwtPayload } from 'jsonwebtoken';

interface IUser {
  id: number;
  name: string;
  email: string;
}

interface ProcessedFileInfo {
  filename: string;
  path: string;
}
interface RequestWithFile extends Request{
  user?: JwtPayload | IUser;
  file?: Express.Multer.File;
  files?: { [fieldname: string]: Express.Multer.File[] } | Express.Multer.File[];
  processedFiles: null | ProcessedFileInfo[];
}

export class ApartsPicturesController {
  static async getAllPictures(req: Request, res: Response, next: NextFunction) {
    try {
      const allPictures = await ApartsPictures.findAll();
      if (allPictures.length === 0) {
        return res.json([]);
      }
      return res.json(allPictures);
    } catch (e) {
      next(e);
    }
  }

  static async getPictures(req: Request, res: Response, next: NextFunction) {
    try {
      const { apartId } = req.params;
      if (!apartId ) {
        throw new BadRequestError(`Не верный ID квартиры: ${apartId}`);
      }
      const pictures = await ApartsPictures.findAll({
        where: { apartId: apartId },
      });
      if (pictures.length === 0) {
        return res.json([]);
      }

      return res.json(pictures);
    } catch (e) {
      next(e);

    }
  }

  static async getOnePicture(req: Request, res: Response, next: NextFunction) {
    const { apartId, imageId } = req.params;
    try {
      const picture = await ApartsPictures.findOne({
        where: {
          id: imageId,
          apartId: apartId,
        },
      });
      if (!picture) {
        throw new NotFoundError(`Картинка с ID: ${imageId} не найдена.`);
      }
      return res.json(picture);
    } catch (e) {
      next(e);
    }
  }

  static async uploadPictures(req: RequestWithFile, res: Response, next: NextFunction) {
    const { apartId } = req.params;
    
    if (!apartId ) {
      throw new BadRequestError(`ID: ${apartId} не корректен.`);
    }

    if (!req.processedFiles || req.processedFiles.length === 0) {
      throw new NotFoundError('Файлы не найдены.');
    }

    try {
      const pictureUrls = await Promise.all(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        req.processedFiles.map(async ({ filename, path }) => {
          const picture = await ApartsPictures.create({
            url: path,
            apartId: apartId,
          });
          return picture.url;
        })
      );

      return res.json(pictureUrls);
    } catch (e) {
      next(e);

    }
  }

  static async deletePicture(req: Request, res: Response, next: NextFunction) {
    try {
      const { apartId, imageId } = req.params;
      if (!imageId) {
        throw new BadRequestError(`ID картинки: ${imageId} не корректен.`);
      }
      const picture = await ApartsPictures.findByPk(imageId);
      if (!picture || picture.apartId !== parseInt(apartId, 10)) {
        throw new NotFoundError(`Картинка с ID: ${imageId} не найдена.`);
      }

      const filePath = path.join(__dirname, '..', '..', picture.url);
      await picture.destroy();

      await fs.promises.unlink(filePath);
      res.json({ message: 'Picture deleted successfully' });
    } catch (e) {
      next(e);
    }
  }
}
