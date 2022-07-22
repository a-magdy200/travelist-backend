import { Router } from 'express'
import {
	createCompany,
	deleteCompany,
	listCompanies,
	showCompany,
	updateCompany,
} from '../../controllers/admin/company/company_controller'

const router = Router()

router.get('/', listCompanies)
router.get('/:id', showCompany)
router.put('/:id', updateCompany)
router.delete('/:id', deleteCompany)
router.post('/', createCompany)

export default router
