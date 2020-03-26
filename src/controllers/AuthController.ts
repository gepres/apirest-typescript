import {Request,Response,NextFunction} from 'express'
import User,{IUser} from '../models/User'
import jwt from 'jsonwebtoken'
const { check,body, validationResult } = require('express-validator')

function createToken(user:IUser){
  return jwt.sign({id:user.id,email:user.email},process.env.SECRET_KEY || '',{expiresIn:'1h'})
 }

export default {
  signup:async(req:Request,res:Response,next:NextFunction) => {
    const erroresExpress = validationResult(req)
    if (!erroresExpress.isEmpty()) {
      const errExp = erroresExpress.errors.map((err:any) => err.msg);
      res.status(400).json(errExp)
      return;
    }
    const uservalidator =  await User.findOne({email:req.body.email})
    if(uservalidator) return res.status(400).json({error:'Usuario ya existe'})
    try {
      const user:IUser = new User(req.body)

      user.password = await user.encryptPassword(user.password)

      const savedUser = await user.save()

      // usuario y pass correcto firmar el token
      const token:string = createToken(savedUser)

      res.header('auth-token',token).json(token)
    } catch (error) {
      console.log(error)
      next(error)
    }
  },
  signin:async (req:Request,res:Response,next?:any) => {
    const erroresExpress = validationResult(req)
    if (!erroresExpress.isEmpty()) {
      const errExp = erroresExpress.errors.map((err:any) => err.msg);
      res.status(400).json(errExp)
      return;
    }
    try {
      const user =  await User.findOne({email:req.body.email})
      if(!user){
        return res.status(400).json({error:'Usuario Incorrecto'})
      }

      const validatePass = await user.validatePassword(req.body.password)
      if(!validatePass){
        return res.status(400).json({error:'contraseña Incorrecta'})
      }
      const token:string = createToken(user)
      res.header('auth-token',token).json(token)
    } catch (error) {
      console.log(error)
      next(error)
    }
  },
  validateUser:[
    body('username').escape(),
    body('password').escape(),
    check('username', 'El nombre de usuario es olbigatorio').notEmpty(),
    check('username', 'El nombre tiene que tener más de 4 caracteres').isLength({ min: 4 }),
    check('email', 'El email es olbigatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').notEmpty(),
    check('password', 'La contraseña tiene que tener más de 4 caracteres').isLength({ min: 4 })
  ],
  validateLogin:[
    body('password').escape(),
    check('email', 'El email es olbigatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').notEmpty(),
    check('password', 'La contraseña tiene que tener más de 4 caracteres').isLength({ min: 4 })
  ]
}