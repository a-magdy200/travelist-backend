import express from 'express';
import path from 'path';
import cookieParser  from 'cookie-parser';
import "reflect-metadata";
import {AppDataSource} from "./src/config/database/data-source";
import logger from "./src/config/logger";
import configurations from "./src/config/configurations";
import hotelsRoutes from "./src/routes/hotels.routes";
const indexRouter = require('./src/routes');
const countryRouter = require('./src/routes/countries.routes');
const companyRouter = require('./src/routes/company.routes');
const userRouter = require('./src/routes/user.routes');
const app = express();
// create a rotating write stream
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));

AppDataSource.initialize().then(connection => {
  const config = configurations();
  // app.use('/', indexRouter);
  app.use('/countries', countryRouter);
  app.use('/api/companies', companyRouter);
  app.use('/api/hotels', hotelsRoutes);
   app.use('/api/userss', userRouter);
  app.listen(config.port, () => {
    console.log("info", "Server is running");
  });
}).catch(error => {
  logger.log("error", "Error connecting to database: " + JSON.stringify(error));
});
