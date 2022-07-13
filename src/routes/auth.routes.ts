import { Router } from 'express'
import { register } from '../controllers/auth/register'
import { login } from '../controllers/auth/login'
import { forgetPassword } from '../controllers/auth/forget_password'
import { resetPassword } from '../controllers/auth/reset_password'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/forget_password', forgetPassword)
router.post('/reset_password', resetPassword)

export default router
