import {Router} from 'express';
import {viewFriendProfile} from "../controllers/user_controller/UserController";
import{uploadProfilePicture} from "../controllers/user_controller/UserController";
const router = Router();


router.get('/:id', viewFriendProfile);
router.post('/:id', uploadProfilePicture);
export default router;
