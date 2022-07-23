import { Router } from 'express'
import {
createPostReport,

} from '../controllers/post_reports/PostReportsController'
import { isAuthenticated } from '../middlewares/isAuthenticated'

const router = Router()
router.post('/', isAuthenticated,createPostReport)

export default router
