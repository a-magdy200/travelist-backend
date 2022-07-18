import { Router } from 'express'
import {
	viewTravelerProfile,
	editTravelerProfile,
	listTravelers,
	listTravelerFriends,
	deleteTravelerFriend,
} from '../controllers/travelers/TravelerController'
const router = Router()

router.get('/', listTravelers)
router.get('/profile', viewTravelerProfile)
router.get('/friends', listTravelerFriends)
router.put('/:id', editTravelerProfile)
router.delete('/delete/:id', deleteTravelerFriend)

export default router
