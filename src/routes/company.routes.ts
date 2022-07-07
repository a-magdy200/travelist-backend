import { Router } from 'express'
import { listCompanies } from '../controllers/CompanyController'
//import {displayByCompany} from '../controllers/CompanyController';
import { editCompanyProfile,viewCompanyProfile,uploadCoverPicture} from '../controllers/CompanyController'
import { storage } from "../helpers/common/storage-customizer";
import { PROFILES_DIRECTORY } from "../helpers/constants/directories";
import { hasToken } from '../middlewares/hasToken'
import { isAuthenticated } from '../middlewares/isAuthenticated'
const multer  = require('multer')
const upload = multer({storage:storage(PROFILES_DIRECTORY)})

const router = Router()

router.get('/', hasToken, isAuthenticated,listCompanies)
//router.get('/:id',displayByCompany);
router.put('/:id', editCompanyProfile)
router.get('/:id', viewCompanyProfile)
router.post('/:id', upload.single('cover_picture'),uploadCoverPicture)
module.exports = router
