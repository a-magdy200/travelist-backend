import { Router } from 'express'
import {
	viewTravelerProfile,
	editTravelerProfile,
	listTravelers,
} from '../controllers/travelers/TravelerController'
const router = Router()

router.get('/', listTravelers)
router.get('/profile', viewTravelerProfile)
router.put('/:id', editTravelerProfile)
export default router
