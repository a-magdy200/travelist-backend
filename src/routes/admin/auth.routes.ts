import { Router } from 'express'
import { login_handler, register_handler } from "../../controllers/admin/auth/auth_controller";

const router = Router()

router.post('/login', login_handler)
router.post('/register', register_handler)

export default router
