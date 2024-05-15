import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ForbiddenError, UnauthorizedError } from '../errors/ApiError';
const JWT_SECRET = process.env.JWT_SECRET;


interface IUser {
  id: number;
  name: string;
  email: string;
}
interface RequestWithUser extends Request {
  user?: IUser;
}

export const verifyToken = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    let token = req.headers['authorization'];

    if (token && token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }

    if (!token) {
      throw new ForbiddenError('Пользователь не авторизован.');
    }

    const decoded = await new Promise<IUser | null>((resolve, reject) => {
      jwt.verify(token, JWT_SECRET!, (err, decoded) => {
        if (err) {
          reject(new UnauthorizedError(`Пользователь не авторизован. ${err.message}`));
        } else if (decoded && typeof decoded === 'object' && 'id' in decoded) {
          resolve(decoded as IUser);
        } else {
          reject(new UnauthorizedError('Пользователь не авторизован. Неверный токен.'));
        }
      });
    });
    
    req.user = decoded as IUser;
    next();
  } catch (e) {
    next(e);
  }
};
