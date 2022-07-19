import { Router } from 'express'
import {
	sendFriendRequest,
	//acceptFriendRequest,
	//rejectFriendRequest,
    cancelFriendRequest,

} from '../controllers/friend_request/FriendRequestController'
const router = Router()

router.post('/send/:id', sendFriendRequest)
//router.post('/accept', acceptFriendRequest)
//router.post('/reject/:id', rejectFriendRequest)
router.post('/cancel/:id', 	cancelFriendRequest)
export default router
