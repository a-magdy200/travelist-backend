import {Router} from 'express';
import {Cycle} from '../../controllers/Cycle/index' 
import multer from 'multer';
import {storage} from "../../helpers/common/storage-customizer";
import {PROGRAMS_DIRECTORY} from "../../helpers/constants/directories";

const router = Router();
const upload = multer({storage: storage(PROGRAMS_DIRECTORY)});

router.get('/all',Cycle.showAll );
router.get('/show/:id',Cycle.show );
router.post('/create',upload.none(),Cycle.create );
router.put('/update/:id',upload.none(),Cycle.update );
router.delete('/delete/:id',Cycle.deleteCycle );

module.exports = router;
