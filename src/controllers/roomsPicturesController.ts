import { RoomsPictures } from '../models/RoomsPictures';
import fs from 'fs';
import path from 'path';
import { NextFunction, Request, Response } from 'express';
import { BadRequestError, NotFoundError } from '../errors/ApiError';

export class RoomsPicturesController {
  static async getAllPictures(req: Request, res: Response, next: NextFunction) {
    try {
      const allPictures = await RoomsPictures.findAll();
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
      const { roomId } = req.params;
      if (!roomId) {
        throw new BadRequestError(`Не верный ID комнаты: ${roomId}`);
      }
      const pictures = await RoomsPictures.findAll({
        where: { roomId: roomId },
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
    const { roomId, imageId } = req.params;
    try {
      const picture = await RoomsPictures.findOne({
        where: {
          id: imageId,
          roomId: roomId,
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
    const { roomId } = req.params;
    if (!roomId) {
      throw new BadRequestError(`ID: ${roomId} не корректен.`);
    }

    if (!req.processedFiles || req.processedFiles.length === 0) {
      throw new NotFoundError('Файлы не найдены.');
    }
    try {
      const pictureUrls = await Promise.all(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        req.processedFiles.map(async ({ filename, path }) => {
          const picture = await RoomsPictures.create({
            url: path,
            roomId: roomId,
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
      const { roomId, imageId } = req.params;
      if (!imageId) {
        throw new BadRequestError(`ID картинки: ${imageId} не корректен.`);
      }
      const picture = await RoomsPictures.findByPk(imageId);
      if (!picture || picture.roomId !== parseInt(roomId, 10)) {
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
