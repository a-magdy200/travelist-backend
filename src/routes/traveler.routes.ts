import { Router } from 'express'
import {
	viewTravelerProfile,
	editTravelerProfile,
	listTravelers,
	listTravelerFriends,
	deleteTravelerFriend,
	homeFeed
} from '../controllers/travelers/TravelerController'
import { isAuthenticated } from '../middlewares/isAuthenticated'

const router = Router()

router.get('/', listTravelers)
router.get('/profile', viewTravelerProfile)
router.get('/friends', listTravelerFriends)
router.put('/', editTravelerProfile)
router.delete('/delete/:id', deleteTravelerFriend)
router.get('/feed', homeFeed)


export default router
