import { Router } from 'express'
import { Program } from '../controllers/program'
import multer from 'multer'
import { storage } from '../helpers/common/storage-customizer'
import { PROGRAMS_DIRECTORY } from '../helpers/constants/directories'
const router = Router()
const upload = multer({ storage: storage(PROGRAMS_DIRECTORY) })

router.get('/all', Program.showAll)
router.get('/company/programs', Program.showCompanyPrograms)
router.get('/show/:id', Program.show)
router.get('/show/cycles/:id', Program.showProgramCycles)
router.post('/create', upload.single('cover_picture'), Program.create)
router.put('/update/:id', upload.single('cover_picture'), Program.update)
router.delete('/delete/:id', Program.deleteProgram)


export default router
