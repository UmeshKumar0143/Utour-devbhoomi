import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { AuthRequest } from './types';

dotenv.config();

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const token = req.cookies?.auth_token || req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(401).json({ message: "Access denied. No token provided." });
      return;
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET not defined in environment variables');
      res.status(500).json({ message: "Server configuration error" });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (error: any) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: "Invalid token" });
    return;
  }
};