import { Router } from 'express'
import { register } from '../controllers/auth/register_handler'
import { login } from '../controllers/auth/login_handler'
import { listUsers } from '../controllers/auth/test_handler'
import { forgetPassword } from '../controllers/auth/forget_pass_handler'
import { verifyCode } from '../controllers/auth/verify_code_handler'
import { resetPassword } from '../controllers/auth/reset_pass_handler'
import { hasToken } from '../middlewares/hasToken'
import { isAuthenticated } from '../middlewares/isAuthenticated'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/forget_password', forgetPassword)
router.post('/verify_code', verifyCode)
router.post('/reset_password', resetPassword)

//test hasToken, isAuthenticated
router.get('/list', hasToken, isAuthenticated, listUsers)

export default router
