import { HousesPictures } from '../models/models';
import fs from 'fs';
import path from 'path';

export class HousesPicturesController {

  static async getAllPictures(req: Request, res: Response) {
    try {
      const allPictures = await HousesPictures.findAll();
      return res.json(allPictures);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: e.message });

    }
  }

  static async getPictures(req: Request, res: Response) {
    const { houseId } = req.params;
    try {
      const pictures = await HousesPictures.findAll({
        where: { houseId: houseId }
      });
      if (pictures.length === 0) {
        return res.json([]);
      }

      return res.json(pictures);
    } catch (e) {
      console.log(e);
      return res.status(500).json({ error: e.message });
    }
  }

  static async getOnePicture(req: Request, res: Response) {
    const { houseId, imageId } = req.params;
    try {
      const picture = await HousesPictures.findOne({
        where: {
          id: imageId,
          houseId: houseId
        }
      });
      if (!picture) {
        return res.status(404).json({ error: 'Picture not found' });
      }
      return res.json(picture);
    } catch (e) {
      console.log(e);
      return res.status(500).json({ error: e.message });
    }
  }

  static async uploadPictures(req: Request, res: Response) {
    const { houseId } = req.params;

    if (!houseId) {
      return res.status(400).json({ error: 'House ID is required' });
    }

    if (!req.processedFiles || req.processedFiles.length === 0) {
      return res.status(400).json({ error: 'No processed files found' });
    }

    try {
      const pictureUrls = await Promise.all(req.processedFiles.map(async ({ filename, path }) => {
        const picture = await HousesPictures.create({
          url: path,
          houseId: houseId
        });
        return picture.url;
      }));

      res.json(pictureUrls);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: e.message });
    }
  }

  static async deletePicture(req: Request, res: Response) {
    try {
      const { houseId, imageId } = req.params;
      if (!imageId) {
        return res.status(400).json({ error: 'ID not specified' });
      }
      const picture = await HousesPictures.findByPk(imageId);
      if (!picture || picture.houseId !== parseInt(houseId, 10)) {
        return res.status(404).json({ error: 'Picture not found' });
      }

      const filePath = path.join(__dirname, '..', '..', picture.url);
      await picture.destroy();

      await fs.promises.unlink(filePath);
      res.json({ message: 'Picture deleted successfully' });
    } catch (e) {
      console.error("Error deleting file:", e);
      return res.status(500).json({ error: e.message });
    }
  }

}
