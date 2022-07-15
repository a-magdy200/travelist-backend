import { Router } from 'express'
import {
createPost
} from '../controllers/posts/PostController'
import { isAuthenticated } from '../middlewares/isAuthenticated'

const router = Router()

// router.get('/', listCompanies)
// router.put('/', isAuthenticated, editCompanyProfile)
// router.get('/profile', viewCompanyProfile)
router.post('/create', createPost)

export default router
