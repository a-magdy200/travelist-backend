import { Router } from 'express'
import {
	viewTravelerProfile,
	editTravelerProfile,
	listTravelers,
	listTravelerFriends,
	deleteTravelerFriend


} from '../controllers/travelers/TravelerController'
const router = Router()

router.get('/', listTravelers)
router.get('/friends',listTravelerFriends)
router.get('/:id', viewTravelerProfile)
router.put('/:id', editTravelerProfile)
router.delete('/delete/:id',deleteTravelerFriend)

export default router
