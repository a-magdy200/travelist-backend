import {
  getAllNotifications,
  readAllNotifications
} from "../../controllers/admin/notifications/notifications_controller";
import {Router} from "express";

const router = Router()

router.get('/', getAllNotifications)
router.post('/read', readAllNotifications)

export default router
