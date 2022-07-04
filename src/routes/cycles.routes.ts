import {Router} from 'express';
import {Cycle} from '../../controllers/Cycle/index' 

const router = Router();

router.get('/all',Cycle.showAll );
router.get('/show/:id',Cycle.show );
router.post('/create',Cycle.create );
router.put('/update/:id',Cycle.update );
router.delete('/delete/:id',Cycle.deleteCycle );

module.exports = router;
