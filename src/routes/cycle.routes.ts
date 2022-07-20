import { Router } from 'express'
import {
	createCycle,
	deleteCycle,
	showAllCycles,
	showCycle,
	updateCycle,
	bookCycle,
	showTravelerBookings
} from '../controllers/cycle'

const router = Router()

router.get('/all', showAllCycles)
router.get('/show/:id', showCycle)
router.get('/traveler/bookings',showTravelerBookings)
router.post('/create', createCycle)
router.post('/book', bookCycle)
router.put('/update/:id', updateCycle)
router.delete('/delete/:id', deleteCycle)

export default router;
