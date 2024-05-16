import { NextFunction, Request, Response } from "express";
import { Roles } from "../services/users/models/Roles";
import { Users } from "../services/users/models/Users";
import { ForbiddenError, NotFoundError } from "../errors/ApiError";

enum AccessRoles {
  USER = "user",
  ADMIN = "admin",
  MAIN_ADMIN = "main_admin",
  DEVELOPER = "developer",
}

const roleAccessLevels: Record<AccessRoles, number> = {
  user: 1,
  admin: 2,
  main_admin: 3,
  developer: 4,
};

interface IUser {
  id: number;
  name: string;
  email: string;
}
interface RequestWithUser extends Request {
  user?: IUser;
}

export const checkRole = (requiredRoles: AccessRoles[]) => {
  return async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      let userWithRoles;
      if (req.user && req.user.id && !isNaN(req.user.id)) {
        userWithRoles = await Users.findOne({
          where: { id: req.user.id },
          include: [{ model: Roles }],
        });
      }

      if (!userWithRoles || !Array.isArray(userWithRoles.roles)) {
        throw new NotFoundError(
          `Не найдена роль пользователя: ${req.user!.id}`
        );
      }

      const userMaxAccessLevel = Math.max(
        ...userWithRoles.roles.map(
          (role) => roleAccessLevels[role.value as AccessRoles] || 0
        )
      );
      const requiredMaxAccessLevel = Math.max(
        ...requiredRoles.map((role) => roleAccessLevels[role] || 0)
      );

      if (userMaxAccessLevel >= requiredMaxAccessLevel) {
        next();
      } else {
        throw new ForbiddenError("Недостаточно прав для выполнения запроса");
      }
    } catch (e) {
      next(e);
    }
  };
};
