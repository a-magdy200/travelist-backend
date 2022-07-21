import { Router } from 'express'

import {
	createGuideReview,
	listGuidesReviews,
	showGuideReviews,
	deleteGuideReview,
} from '../controllers/guide_reviews/guide_reviews_controller'

const router = Router()

router.get('/all', listGuidesReviews)
router.get('/show/:id', showGuideReviews)
router.post('/create', createGuideReview)
router.delete('/delete/:id', deleteGuideReview)

export default router
