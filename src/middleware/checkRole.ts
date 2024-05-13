import { NextFunction, Request, Response } from 'express';
import { Roles } from '../models/Roles';
import { Users } from '../models/Users';
import { ForbiddenError, NotFoundError } from '../errors/ApiError';



const roleAccessLevels: Record<IRole, number> = {
  user: 1,
  admin: 2,
  main_admin: 3,
  developer: 4
};

export const checkRole = (requiredRoles: IRole[]) => {

  
  return async (req: Request, res: Response, next: NextFunction) => {
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
        ...userWithRoles.roles.map((role) => roleAccessLevels[role.value as IRole] || 0)
      );
      const requiredMaxAccessLevel = Math.max(
        ...requiredRoles.map((role) => roleAccessLevels[role] || 0)
      );

      if (userMaxAccessLevel >= requiredMaxAccessLevel) {
        next();
      } else {
        throw new ForbiddenError('Недостаточно прав для выполнения запроса');
      }
    } catch (e) {
      next(e);
    }
  };
};

