// import ApiError from '../error/ApiError';
import { Rooms, RoomsPictures } from '../models/models';
import path from 'path';
import fs from 'fs';
import { Request, Response } from 'express';


export class RoomController {

  static async getAllRooms(req: Request, res: Response) {
    try {
      const allRooms = await Rooms.findAll();
      return res.json(allRooms);
    } catch (e) {
      console.log(e);
      return res.status(500).json({ error: e.message });
    }
  }
  static async getRooms(req: Request, res: Response) {
    try {
      const houseId = req.params.houseId;
      if (!houseId) {
        return res.status(400).json({ error: 'houseId is required' });
      }
      const rooms = await Rooms.findAll({
        where: {
          houseId: houseId
        }
      });
      if (rooms.length === 0) {
        return res.json([]);
      }
      return res.json(rooms);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: e.message });
    }
  }

  static async getOneRoom(req: Request, res: Response) {
    try {
      const { houseId, roomId } = req.params;
      if (!roomId) {
        return res.status(400).json({ error: 'ID not specified' });
      }
      const room = await Rooms.findOne({
        where: {
          id: roomId,
          houseId: houseId
        }
      });
      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }
      return res.json(room);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: e.message });

    }
  }

  static async createRoom(req: Request, res: Response) {
    try {
      const { houseId } = req.body;
      if (!houseId) {
        return res.status(400).json({ error: 'House ID is required.' });
      }
      const room = await Rooms.create({ ...req.body });
      return res.json(room);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: e.message });
    }
  }

  static async updateRoom(req: Request, res: Response) {
    try {
      const { houseId, roomId } = req.params;
      if (!roomId || !houseId) {
        // throw new ApiError(400, 'Room ID and House ID are required');
      }

      const room = await Rooms.findOne({
        where: {
          id: roomId,
          houseId: houseId
        }
      });
      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }
      await room.update(req.body);

      const updatedRoom = await Rooms.findByPk(roomId);
      return res.json(updatedRoom);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: e.message });
    }
  }

  static async deleteRoom(req: Request, res: Response) {
    try {
      const { roomId, houseId } = req.params;
      if (!roomId) {
        return res.status(400).json({ error: 'ID not specified' });
      }
      const room = await Rooms.findOne({
        where: {
          id: roomId,
          houseId: houseId
        }
      });
      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }

      const pictures = await RoomsPictures.findAll({ where: { roomId: roomId } });

      await Promise.all(pictures.map(async (picture) => {
        const filePath = path.join(__dirname, '..', '..', 'public/uploads/roomsPictures', picture.url.split('/').pop());
        await fs.promises.unlink(filePath).catch(e => console.error("Error deleting file:", e));
        await picture.destroy();
      }));


      await room.destroy();
      return res.json({ message: 'Room deleted' });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: e.message });
    }
  }

}
