import express from 'express';
import path from 'path';
import cookieParser  from 'cookie-parser';
import "reflect-metadata";
import {AppDataSource} from "./src/config/database/data-source";
import logger from "./src/config/logger";
import configurations from "./src/config/configurations";
import hotelsRoutes from "./src/routes/hotels.routes";
const indexRouter = require('./src/routes');
const usersRouter = require('./src/routes/countries.routes');

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
  app.use('/countries', usersRouter);
  app.use('/api/hotels', hotelsRoutes);
  app.listen(config.port, () => {
    console.log("info", "Server is running");
  });
}).catch(error => {
  logger.log("error", "Error connecting to database: " + JSON.stringify(error));
});
