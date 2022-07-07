import { Router } from 'express'
import { viewUserProfile } from '../controllers/user_controller/TravelerController'
import { editTravelerProfile } from '../controllers/user_controller/TravelerController'
import { listTravelers } from '../controllers/user_controller/TravelerController'
const router = Router()

router.get('/:id', viewUserProfile)
router.put('/:id', editTravelerProfile)
router.get('/', listTravelers)

export default router
