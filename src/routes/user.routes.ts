import {Router} from 'express';
// import {viewUserProfile} from "../controllers/user_controller/UserController";
import{uploadProfilePicture} from "../controllers/user_controller/UserController";
const router = Router();


// router.get('/:id', viewUserProfile);
router.post('/:id', uploadProfilePicture);
export default router;
