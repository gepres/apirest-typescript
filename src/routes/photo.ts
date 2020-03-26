import {Router} from 'express'
const router = Router();
import PhotoController from '../controllers/PhotoController'
import {tokenValidation} from '../middlewares/verifyToken'


router.get('/',PhotoController.lista)
router.get('/:id', PhotoController.query)
router.post('/',
tokenValidation,
PhotoController.subirImagen,
PhotoController.validatePhoto,
PhotoController.add)
router.put('/:id',
tokenValidation,
PhotoController.subirImagen,
PhotoController.validatePhoto,
PhotoController.update)
router.delete('/:id',tokenValidation,PhotoController.remove)

export default router;