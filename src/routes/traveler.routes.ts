import { Router } from 'express'
import {
	viewTravelerProfile,
	editTravelerProfile,
	listTravelers,
	uploadProfilePicture,
} from '../controllers/travelers/TravelerController'
import { storage } from '../helpers/common/storage-customizer'
import { PROFILES_DIRECTORY } from '../helpers/constants/directories'
import { isAuthenticated } from '../middlewares/isAuthenticated'
const multer = require('multer')
const upload = multer({ storage: storage(PROFILES_DIRECTORY) })
const router = Router()

router.get('/', listTravelers)
router.get('/:id', viewTravelerProfile)
router.put('/:id', editTravelerProfile)
router.patch(
	'/:id',
	upload.single('profile_picture'),
	isAuthenticated,
	uploadProfilePicture
)

export default router
