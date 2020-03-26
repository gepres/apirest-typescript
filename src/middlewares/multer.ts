import {Request,Response} from 'express'
import multer from 'multer'
import shortid from 'shortid'

const configuracionMulter = {
  limits:{fileSize:2000000},
  storage: multer.diskStorage({
    destination:'uploads',
    filename: (req,file,next) => {
      const extension = file.mimetype.split('/')[1];
      next(null,`${shortid.generate()}.${extension}`)
    }
  }),
  fileFilter(req:Request,file:Express.Multer.File,cb?:any){
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
      // el callback se ejecuta como true o false | true cuando la imagen se acepta
      cb(null,true)
    }else{
      cb(new Error('Ese formato no es valido'),false)
    }
  }
}

export default configuracionMulter;