import { NextFunction, Request, Response } from 'express';
import { HousesPictures } from '../models/HousesPictures';
import fs from 'fs';
import path from 'path';
import { BadRequestError, NotFoundError } from '../errors/ApiError';

export class HousesPicturesController {
  static async getAllPictures(req: Request, res: Response, next: NextFunction) {
    try {
      const allPictures = await HousesPictures.findAll();
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
      const { houseId } = req.params;
      if (!houseId) {
        throw new BadRequestError(`Не верный ID дома: ${houseId}`);
      }
      const pictures = await HousesPictures.findAll({
        where: { houseId: houseId },
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
    const { houseId, imageId } = req.params;
    try {
      const picture = await HousesPictures.findOne({
        where: {
          id: imageId,
          houseId: houseId,
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

  static async uploadPictures(req: Request, res: Response, next: NextFunction) {
    const { houseId } = req.params;

    if (!houseId) {
      throw new BadRequestError(`ID: ${houseId} не корректен.`);
    }

    if (!req.processedFiles || req.processedFiles.length === 0) {
      throw new NotFoundError('Файлы не найдены.');
    }

    try {
      const pictureUrls = await Promise.all(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        req.processedFiles.map(async ({ filename, path }) => {
          const picture = await HousesPictures.create({
            url: path,
            houseId: houseId,
          });
          return picture.url;
        })
      );

      res.json(pictureUrls);
    } catch (e) {
      next(e);
    }
  }

  static async deletePicture(req: Request, res: Response, next: NextFunction) {
    try {
      const { houseId, imageId } = req.params;
      if (!imageId) {
        return res.status(400).json({ error: 'ID not specified' });
      }
      const picture = await HousesPictures.findByPk(imageId);
      if (!picture || picture.houseId !== parseInt(houseId, 10)) {
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
