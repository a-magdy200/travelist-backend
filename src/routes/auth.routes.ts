import {Router} from 'express';
import {register} from '../controllers/auth_controller/register_handler';
import {login} from '../controllers/auth_controller/login_handler';
import {list} from '../controllers/auth_controller/test_handler';
import {forgetPassword} from '../controllers/auth_controller/forget_handler';
import {verifyCode} from '../controllers/auth_controller/verify_handler';
import {resetPassword} from '../controllers/auth_controller/reset_handler';
import { hasToken } from '../middlewares/hasToken';
import { isAuthenticated } from '../middlewares/isAuthenticated';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forget_password', forgetPassword);
router.post('/verify_code', verifyCode);
router.post('/reset_password', resetPassword);

//test hasToken, isAuthenticated
router.post('/list', hasToken, isAuthenticated, list);

module.exports = router;
