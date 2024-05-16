import { join } from "path";
import { NextFunction, Request, Response } from "express";
import { Houses } from "../models/Houses";
import { HousesPictures } from "../models/HousesPictures";
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from "../../../errors/ApiError";
import sequelize from "../../../db/db";
import { deletePicture } from "../../../utils/deletePicture";

export class HouseController {
  static async getHouses(req: Request, res: Response, next: NextFunction) {
    try {
      const houses = await Houses.findAll();
      if (houses.length === 0) {
        return res.json([]);
      }
      return res.json(houses);
    } catch (e) {
      next(e);
    }
  }

  static async getOneHouse(req: Request, res: Response, next: NextFunction) {
    try {
      const { houseId } = req.params;
      if (!houseId) {
        throw new BadRequestError(`Не верный ID дома: ${houseId}`);
      }
      const house = await Houses.findByPk(houseId);
      if (!house) {
        throw new NotFoundError(`Дом с ID: ${houseId} не найден.`);
      }
      return res.json(house);
    } catch (e) {
      next(e);
    }
  }

  static async createHouse(req: Request, res: Response, next: NextFunction) {
    try {
      const house = await Houses.create({ ...req.body });
      return res.json(house);
    } catch (e) {
      next(e);
    }
  }

  static async updateHouse(req: Request, res: Response, next: NextFunction) {
    try {
      const { houseId } = req.params;

      if (!houseId) {
        throw new BadRequestError(`Не верный ID дома: ${houseId}`);
      }
      const house = await Houses.findByPk(houseId);
      if (!house) {
        throw new NotFoundError(`Дом с ID: ${houseId} не найден.`);
      }
      await house.update(req.body);
      const updatedHouse = await Houses.findByPk(houseId);
      return res.json(updatedHouse);
    } catch (e) {
      next(e);
    }
  }

  static async deleteHouse(req: Request, res: Response, next: NextFunction) {
    const { houseId } = req.params;
    if (!houseId) {
      throw new BadRequestError(`Не верный ID дома: ${houseId}`);
    }
    const transaction = await sequelize.transaction();
    try {
      const house = await Houses.findByPk(houseId);
      if (!house) {
        await transaction.rollback();
        throw new NotFoundError(`Дом с ID: ${houseId} не найден.`);
      }

      // Находим и удаляем все связанные картинки
      const pictures = await HousesPictures.findAll({
        where: { houseId: houseId },
      });

      await Promise.all(
        pictures.map(async (picture: HousesPictures) => {
          const filename = picture.url.split("/").pop();

          if (!filename) {
            throw new InternalServerError(
              `Не удалось определить имя файла для картинки: ${picture.url}`
            );
          }

          const filePath = join(
            __dirname,
            "..",
            "..",
            "public/uploads/housesPictures",
            filename
          );

          await deletePicture(filePath);
          await picture.destroy({ transaction });
        })
      );

      await house.destroy({ transaction });
      await transaction.commit();
      return res.json({ message: "House deleted" });
    } catch (e) {
      await transaction.rollback();
      next(e);
    }
  }
}
