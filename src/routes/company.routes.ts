import { Router } from 'express'
import { listCompanies } from '../controllers/CompanyController'
//import {displayByCompany} from '../controllers/CompanyController';
import { editCompanyProfile } from '../controllers/CompanyController'
import { viewCompanyProfile } from '../controllers/CompanyController'

const router = Router()

router.get('/', listCompanies)
//router.get('/:id',displayByCompany);
router.put('/:id', editCompanyProfile)
router.get('/:id', viewCompanyProfile)
module.exports = router
