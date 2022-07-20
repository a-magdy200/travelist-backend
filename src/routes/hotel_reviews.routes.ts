import { Router } from 'express'

import {
	createHotelReview,
	listHotelsReviews,
	showHotelReviews,
	deleteHotelReview,
} from '../controllers/hotel_reviews/hotel_reviews_controller'

const router = Router()

router.get('/all', listHotelsReviews)
router.get('/show/:id', showHotelReviews)
router.post('/create', createHotelReview)
router.delete('/delete/:id', deleteHotelReview)

export default router
