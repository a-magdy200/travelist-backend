import { Router } from 'express'
import {
	listCompanies,
	viewCompanyProfile,
	editCompanyProfile,
} from '../controllers/companies/CompanyController'
import { isAuthenticated } from '../middlewares/isAuthenticated'

const router = Router()

router.get('/', listCompanies)
router.put('/:id', isAuthenticated, editCompanyProfile)
router.get('/:id', viewCompanyProfile)

export default router
