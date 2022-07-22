import { Router } from 'express'
import {
createPost,
deletePost,
editPost,
listAllPosts,
listMyPosts,
showPost,
reportPost
} from '../controllers/posts/PostController'
import { isAuthenticated } from '../middlewares/isAuthenticated'

const router = Router()

router.get('/', listAllPosts)
router.get('/myPosts', listMyPosts)
router.post('/', isAuthenticated,createPost)
router.get('/:id', isAuthenticated,showPost)
router.put('/:id', isAuthenticated,editPost)
router.put('/report/:id', isAuthenticated,reportPost)
router.delete('/:id', isAuthenticated,deletePost)

export default router
