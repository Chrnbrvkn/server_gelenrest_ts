import { NextFunction, Request, Response } from "express";
import { Users } from "../models/Users";
import { BadRequestError, NotFoundError } from "../../../errors/ApiError";

export class UserController {
  static async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await Users.findAll();
      if (users.length === 0) {
        return res.json([]);
      }
      return res.json(users);
    } catch (e) {
      next(e);
    }
  }

  static async getOneUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      if (!userId) {
        throw new BadRequestError(`Не верный ID пользователя: ${userId}`);
      }
      const user = await Users.findByPk(userId);
      if (!user) {
        throw new NotFoundError(`Пользователь с ID: ${userId} не найдена.`);
      }
      return res.json(user);
    } catch (e) {
      next(e);
    }
  }

  static async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, name, surname } = req.body;
      const user = await Users.create({ email, password, name, surname });
      return res.json(user);
    } catch (e) {
      next(e);
    }
  }

  static async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      if (!userId) {
        throw new BadRequestError(`Не верный ID пользователя: ${userId}`);
      }
      const user = await Users.findByPk(userId);
      if (!user) {
        throw new NotFoundError(`Пользователь с ID: ${userId} не найдена.`);
      }
      const email = req.body.email;
      const password = req.body.password;
      const name = req.body.name;
      const surname = req.body.surname;
      return res.json(
        user.update(
          {
            email: email,
            password: password,
            name: name,
            surname: surname,
          },
          { where: { id: userId } }
        )
      );
    } catch (e) {
      next(e);
    }
  }

  static async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      if (!userId) {
        throw new BadRequestError(`Не верный ID пользователя: ${userId}`);
      }
      const user = await Users.findByPk(userId);
      if (!user) {
        throw new NotFoundError(`Пользователь с ID: ${userId} не найдена.`);
      }
      await user.destroy();
      return res.json({ message: "User deleted" });
    } catch (e) {
      next(e);
    }
  }

  static async test(req: Request, res: Response, next: NextFunction) {
    try {
      return res.json("HIII IM BORNING!!!");
    } catch (e) {
      next(e);
    }
  }
}
