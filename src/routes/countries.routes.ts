import { get_country } from './../controllers/countries/get_country';
import { show_all_countries } from './../controllers/countries/show_all_countries';
import { Router } from 'express'
import { AppDataSource } from '../config/database/data-source'
import { Country } from '../entities/Country.entity'

const router = Router()

// router.get('/', async function (req, res, next) {
// 	await AppDataSource.manager.insert<Country>(Country, {})
// 	const countries = await AppDataSource.manager.find<Country>(Country)
// 	res.json(countries)
// })

router.get('/show_all', show_all_countries);
router.get('/get_country/:id', get_country);

export default router;
