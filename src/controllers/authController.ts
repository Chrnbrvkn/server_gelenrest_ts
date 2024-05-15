import { generateToken } from '../middleware/jwtUtils';
import bcrypt from 'bcrypt';
import { Roles } from '../models/Roles';
import { Users } from '../models/Users';
import { UserRoles } from '../models/UserRoles';
import { NextFunction, Request, Response } from 'express';
import { BadRequestError, InternalServerError } from '../errors/ApiError';



interface IUser {
  id: number;
  name: string;
  email: string;
}
interface RequestWithUser extends Request {
  user?: IUser;
}

export class AuthController {
  static async createRole(req: Request, res: Response, next: NextFunction) {
    try {
      const { value } = req.body;

      if (!value) {
        throw new InternalServerError(`Такой роли не существует: ${value}`);
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const role = await Roles.create({ value } as any);
      return res.json(role);
    } catch (e) {
      next(e);
    }
  }

  static async getUserRoles(req: Request, res: Response, next: NextFunction) {
    try {
      const roles = await UserRoles.findAll();
      if (roles.length > 0) {
        return res.json(roles);
      }
      return res.json([]);
    } catch (e) {
      next(e);
    }
  }
  static async getRoles(req: Request, res: Response, next: NextFunction) {
    try {
      const roles = await Roles.findAll();
      if (roles.length > 0) {
        return res.json(roles);
      }
      return res.json([]);
    } catch (e) {
      next(e);
    }
  }

  static async registration(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, name, surname, roles } = req.body;
      if (!email || !password) {
        throw new BadRequestError(
          `Email: ${email} and password: ${password} is empty.`
        );
      }
      const existingUser = await Users.findOne({ where: { email } });
      if (existingUser) {
        throw new BadRequestError(
          `The user: ${existingUser} already registered`
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await Users.create({
        email,
        password: hashedPassword,
        name,
        surname,
      });

      if (roles && Array.isArray(roles)) {
        const rolesRecords = await Roles.findAll({ where: { value: roles } });

        if (rolesRecords.length > 0) {
          for (const roleRecord of rolesRecords) {
            await UserRoles.create({
              userId: user.id,
              roleId: roleRecord.id,
            });
          }

          // await user.setRoles(rolesRecords);
        } else {
          throw new BadRequestError(
            `Такой роли не существует: ${JSON.stringify(roles)}`
          );
        }
      } else {
        throw new BadRequestError(`Не валидный формат ролей: ${roles}`);
      }

      const token = generateToken(user);
      return res
        .status(201)
        .json({ message: 'User registered successfully', token });
    } catch (e) {
      next(e);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const user = await Users.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid password' });
      }

      const token = generateToken(user);
      return res.json({ message: 'Login successful', token });
    } catch (e) {
      next(e);
    }
  }

  static async validateToken(req: RequestWithUser, res: Response, next: NextFunction) {
    try {
      return res.status(200).json({
        message: 'Токен действителен',
        user: req.user,
      });
    } catch (e) {
      next(e);
    }
  }
}
