// import ApiError from '../error/ApiError';
import { Rooms } from '../models/Rooms';
import { RoomsPictures } from '../models/RoomsPictures';
import path from 'path';
import { NextFunction, Request, Response } from 'express';
import { BadRequestError, InternalServerError, NotFoundError } from '../errors/ApiError';
import sequelize from '../db';
import { deletePicture } from '../services/utils/deletePicture';

export class RoomController {
  static async getAllRooms(req: Request, res: Response, next: NextFunction) {
    try {
      const allRooms = await Rooms.findAll();
      if (allRooms.length === 0) {
        return res.json([]);
      }
      return res.json(allRooms);
    } catch (e) {
      next(e);
    }
  }
  static async getRooms(req: Request, res: Response, next: NextFunction) {
    try {
      const {houseId} = req.params;
      if (!houseId) {
        throw new BadRequestError(`Не верный ID дома: ${houseId}`);
      }
      const rooms = await Rooms.findAll({
        where: {
          houseId: houseId,
        },
      });
      if (rooms.length === 0) {
        return res.json([]);
      }
      return res.json(rooms);
    } catch (e) {
      next(e);
    }
  }

  static async getOneRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const { houseId, roomId } = req.params;
      if (!roomId) {
        throw new BadRequestError(`Не верный ID комнаты: ${roomId}`);
      }
      const room = await Rooms.findOne({
        where: {
          id: roomId,
          houseId: houseId,
        },
      });
      if (!room) {
        throw new NotFoundError(`Комната с ID: ${roomId} не найдена.`);
      }
      return res.json(room);
    } catch (e) {
      next(e);
    }
  }

  static async createRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const { houseId } = req.body;
      if (!houseId) {
        throw new BadRequestError(`Не верный ID дома: ${houseId}`);
      }
      const room = await Rooms.create({ ...req.body });
      return res.json(room);
    } catch (e) {
      next(e);
    }
  }

  static async updateRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const { houseId, roomId } = req.params;
      if (!roomId || !houseId) {
        throw new BadRequestError(`Не верный ID комнаты: ${roomId}. ID дома: ${houseId}`);
      }

      const room = await Rooms.findOne({
        where: {
          id: roomId,
          houseId: houseId,
        },
      });
      if (!room) {
        throw new NotFoundError(`Комната с ID: ${roomId} не найдена. ID дома: ${houseId}`);
      }
      await room.update(req.body);

      const updatedRoom = await Rooms.findByPk(roomId);
      return res.json(updatedRoom);
    } catch (e) {
      next(e);
    }
  }

  static async deleteRoom(req: Request, res: Response, next: NextFunction) {
    const { roomId, houseId } = req.params;
    if (!roomId || !houseId) {
      throw new BadRequestError(`Не верный ID квартиры: ${roomId}, ID дома: ${houseId}`);
    }
    
    const transaction = await sequelize.transaction();
    try {
      const room = await Rooms.findOne({
        where: {
          id: roomId,
          houseId: houseId,
        },
      });
      if (!room) {
        await transaction.rollback();
        throw new NotFoundError(`Комната с ID: ${roomId} не найдена. Room: ${room}`);
      }

      const pictures = await RoomsPictures.findAll({
        where: { roomId: roomId }, transaction
      });

      await Promise.all(
        pictures.map(async (picture: RoomsPictures) => {
          const filename = picture.url.split('/').pop();

          if(!filename){
            throw new InternalServerError(`Не удалось удалить картинку: ${picture.url}`);
          }

          const filePath = path.join(
            __dirname,
            '..',
            '..',
            'public/uploads/roomsPictures',
            filename
          );

          await deletePicture(filePath);
          await picture.destroy({ transaction});
        })
      );

      await room.destroy({ transaction});
      await transaction.commit();
      return res.json({ message: 'Room deleted' });
    } catch (e) {
      await transaction.rollback();
      next(e);
    }
  }
}
