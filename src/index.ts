if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
import app from './app'
import {startConnection} from './database'

async function main(){
  startConnection()
  await app.listen(app.get('port'))
  console.log('Servidor en el puerto',app.get('port'));
  
}
main()
