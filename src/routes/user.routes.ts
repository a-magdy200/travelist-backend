import { Router } from 'express'
const router = Router()
const multer  = require('multer')
const upload = multer([storage:storage(PROFILES_DIRECTORY)])

// import {viewUserProfile} from "../controllers/user_controller/UserController";
import { updateUserPassword } from '../controllers/user_controller/UserController'
import { editUserProfile } from '../controllers/user_controller/UserController'
import { uploadProfilePicture } from '../controllers/user_controller/UserController'
import { PROFILES_DIRECTORY } from '../../helpers/constants/directories'
import { storage } from '../helpers/common/storage-customizer'


// router.get('/:id', viewUserProfile);
router.post('/:id', uploadProfilePicture,upload.single('avatar'))
router.put('/:id', updateUserPassword)
router.put('/:id', editUserProfile)
export default router
