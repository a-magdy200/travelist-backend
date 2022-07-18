import { Router } from 'express'
import {
	sendFriendRequest,
	//acceptFriendRequest,
	//rejectFriendRequest,
    //cancelFriendReuest,

} from '../controllers/friend_request/FriendRequestController'
const router = Router()

router.get('/send/:id', sendFriendRequest)
//router.post('/accept', acceptFriendRequest)
//router.post('/reject', rejectFriendRequest)
//router.post('/cancel', cancelFriendReues)
export default router
