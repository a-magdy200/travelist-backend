import {Router} from 'express';
import {
  createHotel,
  deleteHotel, listHotels,
  showHotel,
  updateHotel,
  updateHotelCover
} from "../controllers/hotels/hotels_controller";
import multer from 'multer';
import {HOTELS_DIRECTORY, UPLOAD_DIRECTORY} from "../helpers/constants/directories";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${UPLOAD_DIRECTORY}${HOTELS_DIRECTORY}`)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, `${uniqueSuffix}-${file.originalname}`)
  }
})
const upload = multer({storage});
const router = Router();

router.get('/', listHotels);
router.get('/:id', showHotel);
router.put('/:id', updateHotel);
router.delete('/:id', deleteHotel);
router.post('/', createHotel);
router.patch('/:id', upload.single('hotel_cover_picture'), updateHotelCover);

export default router;
