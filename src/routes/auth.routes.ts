import {Router} from 'express';
var Auth_Controller = require('../../controllers/auth_controller');

const router = Router();

// router.post('/register', Auth_Controller.register);
router.post('/login', Auth_Controller.login);

//test authentication 
router.post('/post', Auth_Controller.verifyToken, Auth_Controller.post);

module.exports = router;








