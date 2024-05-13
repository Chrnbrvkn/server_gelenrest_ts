import jwt from 'jsonwebtoken';
import { IUsers } from '../types/scheme_interfaces';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION;
const JWT_SECRET = process.env.JWT_SECRET;

export const generateToken = (user: IUsers) => {
  
  return jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET!, { expiresIn: JWT_EXPIRATION });
};


