import { Houses, HousesPictures } from '../models/models';
import { join } from 'path';
import { promises } from 'fs';
import { Request, Response } from 'express';

export class HouseController {

  static async getHouses(req: Request, res: Response) {
    try {
      const houses = await Houses.findAll();
      if (houses.length === 0) {
        return res.json([]);
      }
      return res.json(houses);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: e.message });
    }
  }

  static async getOneHouse(req: Request, res: Response) {
    try {
      const { houseId } = req.params;
      if (!houseId) {
        return res.status(400).json({ error: 'ID not specified' });
      }
      const house = await Houses.findByPk(houseId);
      if (!house) {
        return res.status(404).json({ error: 'House not found' });
      }
      return res.json(house);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: e.message });
    }
  }

  static async createHouse(req: Request, res: Response) {
    try {
      const house = await Houses.create({ ...req.body });
      return res.json(house);
    } catch (e) {
      console.log(e);
      return res.status(500).json({ error: e.message });
    }
  }

  static async updateHouse(req: Request, res: Response) {
    try {
      const { houseId } = req.params;

      if (!houseId) {
        return res.status(400).json({ error: 'houseId not specified' });
      }
      const house = await Houses.findByPk(houseId);
      if (!house) {
        return res.status(404).json({ error: 'House not found' });
      }
      await house.update(req.body);
      const updatedHouse = await Houses.findByPk(houseId);
      return res.json(updatedHouse);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: e.message });
    }
  }

  static async deleteHouse(req: Request, res: Response) {
    try {
      const { houseId } = req.params;
      if (!houseId) {
        return res.status(400).json({ error: 'ID not specified' });
      }
      const house = await Houses.findByPk(houseId);
      if (!house) {
        return res.status(404).json({ error: 'House not found' });
      }

      // Находим и удаляем все связанные картинки
      const pictures = await HousesPictures.findAll({ where: { houseId: houseId } });
      await Promise.all(pictures.map(async (picture) => {
        const filePath = join(__dirname, '..', '..', 'public/uploads/housesPictures', picture.url.split('/').pop());
        await promises.unlink(filePath).catch(e => console.error('Error deleting file:', e));
        await picture.destroy();
      }));

      await house.destroy();
      return res.json({ message: 'House deleted' });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: e.message });
    }
  }

}
