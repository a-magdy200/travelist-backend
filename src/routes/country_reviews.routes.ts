import { Router } from 'express'

import {
	createCountryReview,
	listCountriesReviews,
	showCountryReviews,
	deleteCountryReview,
} from '../controllers/country_reviews/country_reviews_controller'

const router = Router()

router.get('/all', listCountriesReviews)
router.get('/show/:id', showCountryReviews)
router.post('/create', createCountryReview)
router.delete('/delete/:id', deleteCountryReview)

export default router
