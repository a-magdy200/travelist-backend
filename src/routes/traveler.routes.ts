import { Router } from 'express'
import { viewUserProfile } from '../controllers/user_controller/TravelerController'
import { editUserProfile } from '../controllers/user_controller/TravelerController'
// import{uploadProfilePicture} from "../controllers/user_controller/UserController";
const router = Router()

router.get('/:id', viewUserProfile)
router.put('/:id', editUserProfile)
// router.post('/:id', uploadProfilePicture);
export default router
