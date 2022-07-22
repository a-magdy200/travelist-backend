import { Router } from 'express'
import {
    createGroup,
	deleteGroup,
	showAllGroups,
	showGroup,
	updateGroup,
    addUserGroup,
	removeUserGroup
} from '../controllers/group'
import multer from 'multer'
import { storage } from '../helpers/common/storage-customizer'
import { PROGRAMS_DIRECTORY } from '../helpers/constants/directories'
const router = Router()
const upload = multer({ storage: storage(PROGRAMS_DIRECTORY) })

router.get('/all', showAllGroups)
router.get('/show/:id', showGroup)
router.get('/:groupId/follow', addUserGroup)
router.get('/:groupId/unfollow', removeUserGroup)
router.post('/create', upload.single('cover_picture'), createGroup)
router.put('/update/:id', upload.single('cover_picture'), updateGroup)
router.delete('/delete/:id', deleteGroup)

export default router
