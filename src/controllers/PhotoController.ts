import {Request,Response,NextFunction} from 'express'
import multer from 'multer'
import fs from 'fs-extra'
import Photo from '../models/Photo'
import configuracionMulter from '../middlewares/multer'
const { check,body, validationResult } = require('express-validator')
const cloudinary  =  require('cloudinary').v2


const upload = multer(configuracionMulter).single('imagen');


export default {
  subirImagen:(req:Request,res:Response,next?:any) => {
    upload(req,res, function(error:any){
      if(error){
        // console.log(error);
        if(error instanceof multer.MulterError){
          if(error.code === 'LIMIT_FILE_SIZE'){
           res.status(400).json({'error':'El archivo es muy grande'})
          }else{
            res.status(400).json({'error': error.message})
          }
        }else if(error.hasOwnProperty('message')){
          res.status(400).json({'error': error.message})
        }
        return;
      }else{
        next()
      }
    })
  },
  lista: async (req:Request,res:Response) => {
    try {
      const photos = await Photo.find({}).populate('author',['username','email'])     
      res.json(photos)
    } catch (error) {
      console.log(error); 
    }
  },
  query:async (req:Request,res:Response):Promise<Response> => {
    const photo = await Photo.findById(req.params.id)
    return  res.json(photo)
  },
  add:async (req:Request,res:Response,next:NextFunction) => {
    await cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    })

    const erroresExpress = validationResult(req)
 
    if (!erroresExpress.isEmpty()) {
      const errExp = erroresExpress.errors.map((err:any) => err.msg);
      res.status(400).json(errExp)
      return;
    }
    if(!req.file){
      res.status(400).json({'error': 'La imagen es obligatoria'})
      return;
    }

   try {
    const {title, description} = req.body;
    const result:any = await cloudinary.uploader.upload(req.file.path,{
     folder: 'typescript/books'
    })
  
    const newPhoto = {
      title:title,
      description:description,
      image_url:result.url,
      public_id:result.public_id,
      author:req.userId
    }
 
 
     const photo = new Photo(newPhoto)
     await photo.save()
     await fs.unlink(req.file.path)
     return res.json({
       mensaje:'Foto guadada.',
       photo
     })
      
   } catch (error) {
      console.log(error);
      next(error);
   }
  },
  update:async (req:Request,res:Response,next?:any) => {
    const erroresExpress = validationResult(req)
    if (!erroresExpress.isEmpty()) {
      const errExp = erroresExpress.errors.map((err:any) => err.msg);
      res.status(400).json(errExp)
      return;
    }
    try {
      await cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
      })
      const photoAnterior:any = await Photo.findOne({_id:req.params.id})
      // construir un nuevo producto
      let photoNueva = req.body
      // verificar si hay imagen nueva
      if(req.file){
        const result:any = await cloudinary.uploader.upload(req.file.path,{
          folder: 'typescript/books'
        })
        await cloudinary.uploader.destroy(photoAnterior.public_id)
        photoNueva.image_url = result.url,
        photoNueva.public_id = result.public_id
        await fs.unlink(req.file.path)
      }
      await Photo.findOneAndUpdate({_id:req.params.id},photoNueva)
      return res.status(200).json({
        mensaje:'Producto Actualizado'
      })
    } catch (error) {
      console.log(error);
      next(error);
    }
    
  },
  remove:async (req:Request,res:Response,next?:any):Promise<Response> => {
    const photo = await Photo.findByIdAndDelete(req.params.id)
    if(!photo){
      res.json({
        mensaje:'Ese Producto no existe'
      })
      return next()
    }
    await cloudinary.uploader.destroy(photo.public_id)
    return res.status(200).json({
      mensaje:'Foto Eliminada'
    })
  },
  validatePhoto:[
    body('title').escape(),
    body('description').escape(),
    check('title', 'El titulo es olbigatorio').notEmpty(),
    check('description', 'La descripción es obligatorio').notEmpty()
  ]
}