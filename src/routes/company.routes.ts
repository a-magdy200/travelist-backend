import {Router} from 'express';
import {displayAllCompanies} from '../controllers/CompanyController';
import {displayByCompany} from '../controllers/CompanyController';
import {editCompanyData} from '../controllers/CompanyController';
import {updatePassword} from '../controllers/CompanyController';

const router = Router();

router.get('/',displayAllCompanies);
router.get('/:id',displayByCompany);
router.put('/:id',editCompanyData);
router.put('/:id',updatePassword)
module.exports = router;
