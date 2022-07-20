import { Router } from 'express'
import {
  get_profile, update_cover_picture,
  update_password,
  update_profile,
  update_profile_picture
} from "../../controllers/admin/user/user_controller";
import multer from "multer";
import { storage } from "../../helpers/common/storage-customizer";
import { USER_DIRECTORY } from "../../helpers/constants/directories";

const router = Router()
const upload = multer({ storage: storage(USER_DIRECTORY) })

router.get('/profile', get_profile)
router.put('/profile', update_profile)
router.patch('/update-password', update_password)
router.patch('/update-profile-picture', upload.single("profile_picture"), update_profile_picture)
router.patch('/update-cover-picture', upload.single("cover_picture"), update_cover_picture)

export default router
