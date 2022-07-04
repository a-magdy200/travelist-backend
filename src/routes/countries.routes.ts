import {Router} from 'express';
import {AppDataSource} from "../config/database/data-source";
import {Country} from "../entities/Country.entity";

const router = Router();

router.get('/', async function(req, res, next) {

  await AppDataSource.manager.insert<Country>(Country, {

  });

  const countries = await AppDataSource.manager.find<Country>(Country);

  res.json(countries);

});

export default router;
