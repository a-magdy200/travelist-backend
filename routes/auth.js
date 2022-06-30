var express = require('express');
var router = express.Router();

var Auth_Controller = require('../controllers/auth_controller');

// router.post('/register', Auth_Controller.register);
router.post('/login', Auth_Controller.login);
router.post('/post', Auth_Controller.verifyToken,Auth_Controller.post);

module.exports = router;
