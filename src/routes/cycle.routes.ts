import { Router } from 'express'
import {
	createCycle,
	deleteCycle,
	showAllCycles,
	showCycle,
	updateCycle,
} from '../controllers/cycle'

const router = Router()

router.get('/all', showAllCycles)
router.get('/show/:id', showCycle)
router.post('/create', createCycle)
router.put('/update/:id', updateCycle)
router.delete('/delete/:id', deleteCycle)

export default router;
