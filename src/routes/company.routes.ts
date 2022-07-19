import { Router } from 'express'
import {
	listCompanies,
	viewCompanyProfile,
	editCompanyProfile,
	showCompany
} from '../controllers/companies/CompanyController'
import { isAuthenticated } from '../middlewares/isAuthenticated'

const router = Router()

router.get('/', listCompanies)
router.put('/', isAuthenticated, editCompanyProfile)
router.get('/profile', viewCompanyProfile)
router.get('/show/:id',showCompany )


export default router
