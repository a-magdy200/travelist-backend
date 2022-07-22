import { searchHotel } from './../controllers/search/search_hotel';
import { searchProgram } from './../controllers/search/search_program';
import { searchCompany } from './../controllers/search/search_company';
import { searchTraveler } from './../controllers/search/search_traveler';
import { searchCountry } from '../controllers/search/search_country';
import { Router } from "express";

const router = Router();

router.get('/country', searchCountry);
router.get('/traveler', searchTraveler);
router.get('/company', searchCompany);
router.get('/program', searchProgram);
router.get('/hotel', searchHotel);

export default router