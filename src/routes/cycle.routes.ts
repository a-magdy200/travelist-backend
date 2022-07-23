import { Router } from 'express'
import {
	createCycle,
	deleteCycle,
	showAllCycles,
	showCycle,
	updateCycle,
	bookCycle,
	showTravelerBookings,
	showBookings,
	showOneBooking,
	deleteBooking,
	showCompanyBookings
} from '../controllers/cycle'
import { showCompanyCycles } from '../controllers/cycle/show-company-cycles'

const router = Router()

router.get('/all', showAllCycles)
router.get('/company/all', showCompanyCycles)
router.get('/show/:id', showCycle)
router.get('/bookings/traveler',showTravelerBookings)
router.get('/bookings',showBookings)
router.get('/bookings/company',showCompanyBookings)
router.get('/bookings/show/:id', showOneBooking)
router.post('/create', createCycle)
router.post('/book', bookCycle)
router.put('/update/:id', updateCycle)
router.delete('/delete/:id', deleteCycle)
router.delete('/booking/delete/:id', deleteBooking)

export default router;
