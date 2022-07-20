import { Router } from 'express'
import {sendFriendRequest} from '../controllers/friend_request/send_friend_request'
import {acceptFriendRequest} from '../controllers/friend_request/accept_friend_request'
import {rejectFriendRequest} from '../controllers/friend_request/reject_friend_request'
import {cancelFriendRequest} from '../controllers/friend_request/cancel_friend_request'
const router = Router()

router.post('/send/:id', sendFriendRequest)
router.post('/accept/:id', acceptFriendRequest)
router.post('/reject/:id', rejectFriendRequest)
router.post('/cancel/:id', 	cancelFriendRequest)
export default router
