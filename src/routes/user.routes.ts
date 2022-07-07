import { Router } from 'express'
const router = Router()
const multer = require('multer')
// import {viewUserProfile} from "../controllers/user_controller/UserController";
import { updateUserPassword } from '../controllers/user_controller/UserController'
import { editUserProfile } from '../controllers/user_controller/UserController'

router.patch('/:id', updateUserPassword)
router.put('/:id', editUserProfile)
export default router
