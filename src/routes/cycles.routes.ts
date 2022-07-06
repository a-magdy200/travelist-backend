import { Router } from 'express'
import multer from 'multer'
import { storage } from '../helpers/common/storage-customizer'
import { PROGRAMS_DIRECTORY } from '../helpers/constants/directories'
import {
	createCycle,
	deleteCycle,
	showAllCycles,
	showCycle,
	updateCycle,
} from '../controllers/Cycle'

const router = Router()
const upload = multer({ storage: storage(PROGRAMS_DIRECTORY) })

router.get('/all', showAllCycles)
router.get('/show/:id', showCycle)
router.post('/create', upload.none(), createCycle)
router.put('/update/:id', upload.none(), updateCycle)
router.delete('/delete/:id', deleteCycle)

module.exports = router
