import { generateToken } from '../middleware/jwtUtils';
import bcrypt from 'bcrypt';
import { Roles, Users, UserRoles } from '../models/models';
import { Request, Response } from 'express';

export class AuthController {

  static async createRole(req: Request, res: Response) {
    try {
      const { value } = req.body;

      const role = await Roles.create({ value });
      return res.json(role);
    } catch (e) {
      console.log(e);
      return res.status(500).json({ error: e.message });
    }
  }

  static async getUserRoles( res: Response) {
    try {
      const roles = await UserRoles.findAll();
      if (roles.length > 0) {
        return res.json(roles);
      }
      return res.json([])
    } catch (e) {
      console.log(e);
      return res.status(500).json({ error: e.message });
    }
  }
  static async getRoles(res: Response) {
    try {
      const roles = await Roles.findAll();
      if (roles.length > 0) {
        return res.json(roles);
      }
      return res.json([])
    } catch (e) {
      console.log(e);
      return res.status(500).json({ error: e.message });
    }
  }

  static async registration(req: Request, res: Response) {
    try {
      const { email, password, name, surname, roles } = req.body;

      const existingUser = await Users.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'User with this email already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await Users.create({ email, password: hashedPassword, name, surname });

      if (roles && Array.isArray(roles)) {
        const rolesRecords = await Roles.findAll({ where: { value: roles } });
        if (rolesRecords.length > 0) {
          await user.setRoles(rolesRecords);
        } else {
          return res.status(400).json({ error: 'Такой роли не существует!' });
        }
      }

      const token = generateToken(user)
      return res.status(201).json({ message: 'User registered successfully', token });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ error: e.message });
    }
  }

  static async login(req: Request, res: Response) {
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

      const token = generateToken(user)
      return res.json({ message: 'Login successful', token });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ error: e.message });
    }
  }

  static async validateToken(req: Request, res: Response) {

    return res.status(200).json({
      message: 'Токен действителен',
      user: req.user,
    });
  }

}
