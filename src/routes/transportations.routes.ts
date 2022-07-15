import { Router } from 'express'
import {
	createTransportation,
	deleteTransportation,
	listTransportations,
	showTransportation,
	updateTransportation,
} from '../controllers/transportations/transportations_controller'
const router = Router()

router.get('/', listTransportations)
router.get('/:id', showTransportation)
router.put('/:id', updateTransportation)
router.delete('/:id', deleteTransportation)
router.post('/', createTransportation)

export default router
