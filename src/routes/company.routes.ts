import { Router } from 'express'
import {
	listCompanies,
	viewCompanyProfile,
} from '../controllers/companies/CompanyController'
import {
	editCompanyProfile,
	uploadCoverPicture,
} from '../controllers/companies/CompanyController'
import { storage } from '../helpers/common/storage-customizer'
import { PROFILES_DIRECTORY } from '../helpers/constants/directories'
import { isAuthenticated } from '../middlewares/isAuthenticated'
const multer = require('multer')
const upload = multer({ storage: storage(PROFILES_DIRECTORY) })

const router = Router()

router.get('/', listCompanies)
router.put('/:id', isAuthenticated, editCompanyProfile)
router.get('/:id', viewCompanyProfile)
router.post(
	'/:id',
	isAuthenticated,
	upload.single('cover_picture'),
	uploadCoverPicture
)
module.exports = router
