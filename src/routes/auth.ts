import {Router} from 'express'
const router = Router();
import AuthController from '../controllers/AuthController'

router.post('/signup',AuthController.validateUser,AuthController.signup)
router.post('/signin',AuthController.validateLogin,AuthController.signin)

export default router;