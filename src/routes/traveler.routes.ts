import { Router } from 'express'
import { viewUserProfile } from '../controllers/user_controller/TravelerController'
import { editTravelerProfile } from '../controllers/user_controller/TravelerController'
import { listTravelers } from '../controllers/user_controller/TravelerController'
// import{uploadProfilePicture} from "../controllers/user_controller/UserController";
const router = Router()

router.get('/:id', viewUserProfile)
router.put('/:id', editTravelerProfile)
router.get('/', listTravelers)

// router.post('/:id', uploadProfilePicture);
export default router
