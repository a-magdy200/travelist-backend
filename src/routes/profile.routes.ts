import {Router} from 'express';
//import {displayProfile} from '../controllers/profileController';
const profileController = require('../controllers/profileController');

const router = Router();

router.get('/api/companies/:id',displayProfile);


module.exports = router;