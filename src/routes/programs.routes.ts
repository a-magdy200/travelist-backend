import {Router} from 'express';
import { Program } from '../../controllers/Program/index' 

const router = Router();

router.get('/all',Program.showAll );
router.get('/show/:id',Program.show );
router.post('/create',Program.create );
router.put('/update/:id',Program.update );
router.delete('/delete/:id',Program.deleteProgram );

module.exports = router;
