import { Router } from 'express'
import {
	createHotel,
	deleteHotel,
	listHotels,
	showHotel,
	updateHotel,
	updateHotelCover,
} from '../controllers/hotels/hotels_controller'
import multer from 'multer'
import { storage } from '../helpers/common/storage-customizer'
import { HOTELS_DIRECTORY } from '../helpers/constants/directories'

const upload = multer({ storage: storage(HOTELS_DIRECTORY) })
const router = Router()

router.get('/', listHotels)
router.get('/:id', showHotel)
router.put('/:id', updateHotel)
router.delete('/:id', deleteHotel)
router.post('/', createHotel)
router.patch('/:id', upload.single('hotel_cover_picture'), updateHotelCover)

export default router
