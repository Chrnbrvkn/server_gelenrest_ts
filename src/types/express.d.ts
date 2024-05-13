import { JwtPayload } from 'jsonwebtoken';


declare global {
  namespace Express {
    
    interface IUser {
      id: number,
      name: string,
      email: string
    }

    interface ProcessedFileInfo {
      filename: string;
      path: string;
    }

    interface Request {
      user?: JwtPayload | IUser,
      file?: Multer.File,
      files?: {[fieldname: string] : Multer.File[]} | Multer.File[],
      processedFiles?: ProcessedFileInfo[]
    }
  }
  interface SequelizeError extends Error {
    name: string;
    errors?: { message: string }[];
    sql?: string;
  }

  type IRole = 'user' | 'admin' | 'main_admin' | 'developer';
}


export { };