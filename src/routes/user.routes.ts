import { Router } from 'express'
const router = Router()
const multer = require('multer')
import { updateUserPassword, viewUserProfile, editUserProfile, uploadProfilePicture,getUserId} from '../controllers/user_controller/UserController'
import { storage } from "../helpers/common/storage-customizer";
import { USER_DIRECTORY } from "../helpers/constants/directories";
const upload = multer({ storage: storage(USER_DIRECTORY) })

router.patch('/:id', updateUserPassword)
router.put('/', editUserProfile)
router.put('/:id/profile_picture', upload.single("profile_picture"), uploadProfilePicture)
router.get('/', viewUserProfile)
router.get('/current/user', getUserId)
export default router
