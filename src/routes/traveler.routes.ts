import { Router } from 'express'
import {
	viewTravelerProfile,
	editTravelerProfile,
	listTravelers,
	listTravelerFriends,

} from '../controllers/travelers/TravelerController'
const router = Router()

router.get('/', listTravelers)
router.get('/friends',listTravelerFriends)
router.get('/:id', viewTravelerProfile)
router.put('/:id', editTravelerProfile)
export default router
