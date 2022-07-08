import { Router } from 'express'
import { listCompanies } from '../controllers/companies/CompanyController'
import { editCompanyProfile,uploadCoverPicture,viewCompanyProfile} from '../controllers/companies/CompanyController'
import { storage } from "../helpers/common/storage-customizer";
import { PROFILES_DIRECTORY } from "../helpers/constants/directories";
import { isAuthenticated } from '../middlewares/isAuthenticated'
const multer  = require('multer')
const upload = multer({storage:storage(PROFILES_DIRECTORY)})

const router = Router()

router.get('/', isAuthenticated,listCompanies)
router.put('/:id', editCompanyProfile,isAuthenticated)
 router.get('/:id', viewCompanyProfile)
router.post('/:id', upload.single('cover_picture'),uploadCoverPicture,isAuthenticated)
module.exports = router
