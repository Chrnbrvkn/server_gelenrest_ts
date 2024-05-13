import path from 'path';
import { Aparts } from '../models/Aparts';
import { ApartsPictures } from '../models/ApartsPictures';
import { NextFunction, Request, Response } from 'express';
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from '../errors/ApiError';
// import { IApartsPictures } from '../types/scheme_interfaces';
import sequelize from '../db';
import { deletePicture } from '../services/utils/deletePicture';

export class ApartController {
  static async getAparts(req: Request, res: Response, next: NextFunction) {
    try {
      const aparts = await Aparts.findAll();
      if (aparts.length === 0) {
        return res.json([]);
      }
      return res.json(aparts);
    } catch (e) {
      next(e);
    }
  }

  static async getOneApart(req: Request, res: Response, next: NextFunction) {
    try {
      const { apartId } = req.params;
      if (!apartId ) {
        throw new BadRequestError(`Не верный ID квартиры: ${apartId}`);
      }
      const apart = await Aparts.findByPk(apartId);
      if (!apart) {
        throw new NotFoundError(`Квартира с ID: ${apartId} не найдена.`);
      }
      return res.json(apart);
    } catch (e) {
      next(e);
    }
  }

  static async createApart(req: Request, res: Response, next: NextFunction) {
    try {
      const apart = await Aparts.create({ ...req.body });
      return res.json(apart);
    } catch (e) {
      next(e);
    }
  }

  static async updateApart(req: Request, res: Response, next: NextFunction) {
    try {
      const { apartId } = req.params;
      if (!apartId) {
        throw new BadRequestError(`Не верный ID квартиры: ${apartId}`);
      }
      const apart = await Aparts.findByPk(apartId);
      if (!apart) {
        throw new NotFoundError(`Квартира с ID: ${apartId} не найдена.`);
      }
      await apart.update(req.body);
      const updatedApart = await Aparts.findByPk(apartId);
      return res.json(updatedApart);
    } catch (e) {
      next(e);
    }
  }

  static async deleteApart(req: Request, res: Response, next: NextFunction) {
    const { apartId } = req.params;
    if (!apartId ) {
      throw new BadRequestError(`Не верный ID квартиры: ${apartId}`);
    }

    const transaction = await sequelize.transaction();
    try {
      const apart = await Aparts.findByPk(apartId, { transaction });
      if (!apart) {
        await transaction.rollback();
        throw new NotFoundError(`Квартира с ID: ${apartId} не найдена.`);
      }

      // Находим и удаляем все связанные картинки
      const pictures = await ApartsPictures.findAll({
        where: { apartId: apartId },
        transaction,
      });

      await Promise.all(
        pictures.map(async (picture: ApartsPictures) => {
          const filename = picture.url.split('/').pop();

          if (!filename) {
            throw new InternalServerError(
              `Не удалось определить имя файла для картинки: ${picture.url}`
            );
          }

          const filePath = path.join(
            __dirname,
            '..',
            '..',
            'public/uploads/apartsPictures',
            filename
          );
          await deletePicture(filePath);
          await picture.destroy({ transaction });
        })
      );
      await apart.destroy({ transaction });
      await transaction.commit();
      return res.json({ message: 'Apart deleted' });
    } catch (e) {
      await transaction.rollback();
      next(e);
    }
  }
}
