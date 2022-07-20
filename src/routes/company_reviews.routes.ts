import { Router } from 'express'

import {
	createCompanyReview,
	listCompaniesReviews,
	showCompanyReviews,
	deleteCompanyReview,
} from '../controllers/company_reviews/company_reviews_controller'

const router = Router()

router.get('/all', listCompaniesReviews)
router.get('/show/:id', showCompanyReviews)
router.post('/create', createCompanyReview)
router.delete('/delete/:id', deleteCompanyReview)

export default router
