import { Router } from 'express'

import {
	createCycleReview,
	listCyclesReviews,
	showCycleReviews,
	deleteCycleReview,
} from '../controllers/cycle_reviews/cycle_reviews_controller'

const router = Router()

router.get('/all', listCyclesReviews)
router.get('/show/:id', showCycleReviews)
router.post('/create', createCycleReview)
router.delete('/delete/:id', deleteCycleReview)

export default router
