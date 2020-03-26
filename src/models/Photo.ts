import {Schema,model,Document} from 'mongoose'

const Photos = new Schema({
  title:{
    type:String,
    trim:true,
    lowercase:true,
    require:[true,'Agrega el titulo']
  },
  description:{
    type:String,
    trim:true
  },
  author:{
    type:Schema.Types.ObjectId,
    ref:'User'
  },
  image_url:String,
  public_id:{
    type:String,
    unique:true
  },
  create_at: {
    type: Date,
    default: Date.now
  }
})

interface IPhoto extends Document{
  title:string;
  description:string;
  image_url:string;
  public_id:string;
  date:Date;
}

export default model<IPhoto>('Photo', Photos);