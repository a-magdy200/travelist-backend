import { Router } from 'express'
import {sendFriendRequest} from '../controllers/friend_request/send_friend_request'
import {acceptFriendRequest} from '../controllers/friend_request/accept_friend_request'
import {rejectFriendRequest} from '../controllers/friend_request/reject_friend_request'
import {cancelFriendRequest} from '../controllers/friend_request/cancel_friend_request'
import {listReceivedRequests} from '../controllers/friend_request/list_friend_requests'
import {listSentRequests} from '../controllers/friend_request/list_friend_requests'
const router = Router()

router.post('/send/:id', sendFriendRequest)
router.put('/accept/:id', acceptFriendRequest)
router.put('/reject/:id', rejectFriendRequest)
router.delete('/cancel/:id', 	cancelFriendRequest)
router.get('/received', 	listReceivedRequests)
router.get('/sent', 	listSentRequests)
export default router
