import { Router } from 'express'
import {
	createGroup,
	deleteGroup,
	listGroups,
	showGroup,
	updateGroup,
} from '../../controllers/admin/groups/groups_controller'
const router = Router()

router.get('/', listGroups)
router.get('/:id', showGroup)
router.put('/:id', updateGroup)
router.delete('/:id', deleteGroup)
router.post('/', createGroup)

export default router
