import express,{Application} from 'express'
import morgan from 'morgan'
import path from 'path'

import photoRoutes from './routes/photo'
import authRoutes from './routes/auth'
import viewsRoutes from './routes/views'

// initilization
const app:Application = express();

// settings
app.set('port', process.env.PORT || 3000 )


// middlewares
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended:false}))


// routes
app.use('/api/photo',photoRoutes)
app.use('/api/auth',authRoutes)
app.use('/',viewsRoutes)

// folder storage public files
app.use('/uploads', express.static(path.resolve('uploads')))



export default app;