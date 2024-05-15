import 'express';
import { JwtPayload } from 'jsonwebtoken';


declare global {
  namespace Express {
    interface IUser {
      id: number;
      name: string;
      email: string;
    }

    interface ProcessedFileInfo {
      filename: string;
      path: string;
    }

    interface Request {
      user?: JwtPayload | IUser;
      file?: Express.Multer.File;
      files?: { [fieldname: string]: Express.Multer.File[] } | Express.Multer.File[];
      processedFiles: null | ProcessedFileInfo[];
    }
  }
}

export {};