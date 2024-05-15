import multer, {FileFilterCallback} from 'multer';
import sharp from 'sharp';
import fs from 'fs';
import util from 'util';
import path from 'path';
import {Request, Response, NextFunction } from 'express';
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


const mkdir = util.promisify(fs.mkdir);

// Хранение файлов в памяти для последующей обработки с помощью sharp
const storage = multer.memoryStorage();

// Фильтр для проверки типов файлов
const fileFilter = (req: RequestWithFile, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Неподдерживаемый тип файла'));
  }
};

// Настройка Multer
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 15 * 1024 * 1024 } // 15 МБ
});

// Определение пути для сохранения обработанных изображений
const getUploadPath = (req: RequestWithFile) => {
  const baseUploadPath = 'public/uploads/';
  if (req.path.includes('/house')) return path.join(baseUploadPath, 'housesPictures');
  if (req.path.includes('/apart')) return path.join(baseUploadPath, 'apartsPictures');
  if (req.path.includes('/room')) return path.join(baseUploadPath, 'roomsPictures');
  return baseUploadPath; // Путь по умолчанию, если не совпадает ни с одним условием
};

// Middleware для обработки и сохранения изображений
export const processAndSaveImage = async (req: RequestWithFile, res: Response, next: NextFunction) => {
  if (!req.files || req.files.length === 0) return next(); // Пропускаем, если файлы не загружены

  if(Array.isArray(req.files)){
    
    try {
      const uploadPath = getUploadPath(req);
      await mkdir(uploadPath, { recursive: true });

      const processedFilesInfo = await Promise.all(req.files.map(async (file) => {
        const filename = `${file.fieldname}-${Date.now()}.webp`;
        const relativeOutputPath = `/public/uploads/${req.path.includes('/house') ? 'housesPictures' : req.path.includes('/apart') ? 'apartsPictures' : 'roomsPictures'}/${filename}`;
        const outputPath = path.join(uploadPath, filename);

        await sharp(file.buffer)
          .resize(800)
          .toFormat('webp', { quality: 95 })
          .toFile(outputPath);

        return { filename, path: relativeOutputPath };
      }));

      req.processedFiles = processedFilesInfo; // Сохраняем информацию об обработанных файлах в req
      next();
    } catch (e) {
      console.error('Error processing image:', e);
      next(e);
    }
  
  
  }
};

