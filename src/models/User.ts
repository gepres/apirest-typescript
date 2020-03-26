import {Schema,model,Document} from 'mongoose'
import bcrypt from 'bcrypt'

const Users = new Schema({
  username:{
    type:String,
    trim:true,
    lowercase:true,
    require:[true,'Agrega tu usuario']
  },
  email:{
    type:String,
    unique:true,
    lowercase:true,
    trim:true,
    require:[true,'Agrega tu Correo']
  },
  password:{
    type:String,
    trim:true
  },
  description:String,
  token:String,
  expira:Date,
  date:{
    type:Date,
    default:Date.now
  }
})

export interface IUser extends Document{
  username:string;
  email:string;
  password:string;
  description:string;
  token:string;
  expira:Date;
  date:Date;
  encryptPassword(password:string):Promise<string>;
  validatePassword(password:string):Promise<boolean>
}

Users.methods.encryptPassword = async (password:string):Promise<string> => {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password,salt)
}
Users.methods.validatePassword = async function(password:string):Promise<boolean> {
  return await bcrypt.compare(password,this.password)
}

export default model<IUser>('User', Users);