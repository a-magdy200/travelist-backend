import {Router} from 'express';
import {displayProfile} from '../controllers/profileController';
import {editProfileData} from '../controllers/profileController';
// const profileController = require('../controllers/profileController');

const router = Router();

router.get('/:id',displayProfile);
router.put('/:id',editProfileData);

module.exports = router;
