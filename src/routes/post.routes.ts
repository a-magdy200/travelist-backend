import { Router } from 'express'
import {
createPost,
deletePost,
editPost,
listPosts,
showPost
} from '../controllers/posts/PostController'
import { isAuthenticated } from '../middlewares/isAuthenticated'

const router = Router()

router.get('/', listPosts)
router.post('/', isAuthenticated,createPost)
router.get('/:id', isAuthenticated,showPost)
router.put('/:id', isAuthenticated,editPost)
router.delete('/:id', isAuthenticated,deletePost)

export default router
