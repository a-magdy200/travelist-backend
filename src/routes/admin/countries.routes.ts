import { Router } from 'express'
import {
	createCountry,
	deleteCountry,
	listCountries,
	showCountry,
	updateCountry,
} from '../../controllers/admin/countries/countries_controller'

const router = Router()

router.get('/', listCountries)
router.get('/:id', showCountry)
router.put('/:id', updateCountry)
router.delete('/:id', deleteCountry)
router.post('/', createCountry)

export default router
