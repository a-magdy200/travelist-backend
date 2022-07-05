import express from 'express';
import path from 'path';
import cookieParser  from 'cookie-parser';
import "reflect-metadata";
import {AppDataSource} from "./src/config/database/data-source";
import logger from "./src/config/logger";
import configurations from "./src/config/configurations";

const indexRouter = require('./src/routes');
const usersRouter = require('./src/routes/countries.routes');
const programRouter = require('./src/routes/programs.routes');
const cycleRouter = require('./src/routes/cycles.routes');


const app = express();
const cors = require('cors');
app.use(cors({
  origin: '*'
}));

// create a rotating write stream
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


AppDataSource.initialize().then(connection => {
  const config = configurations();
  app.use('/', indexRouter);
  app.use('/programs', programRouter);
  app.use('/cycles', cycleRouter);
  app.use('/countries', usersRouter);
  app.listen(config.port, () => {
    // logger.log("info", "Server is running");
  });
}).catch(error => {
  logger.log("error", "Error connecting to database: " + JSON.stringify(error));
});
