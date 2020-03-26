import {Request,Response,NextFunction} from 'express'
import jwt from 'jsonwebtoken'

interface IPayload {
  id: string;
  email: string;
  iat: number;
  exp: number
}

export const tokenValidation = (req:Request,res:Response,next:NextFunction) => {
  try {
    const token = req.header('auth-token');

    if (!token) return res.status(401).json('Acceso denegado');
    const payload = jwt.verify(token, process.env['SECRET_KEY'] || '') as IPayload;
    req.userId = payload.id;
    next();
  } catch (e) {
      res.status(400).send('Token Invalido');
  }
}