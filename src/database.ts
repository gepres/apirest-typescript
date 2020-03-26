import {connect} from 'mongoose';
export async function startConnection(){
  await connect(`${process.env.MONGODB_URI}`, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
  })
  .then(db => console.log('db esta conectada'))
  .catch(err => console.error(err))
}