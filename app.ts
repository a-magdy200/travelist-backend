import express from 'express';
import path from 'path';
import cookieParser  from 'cookie-parser';
import "reflect-metadata";
import {AppDataSource} from "./src/config/database/data-source";
import logger from "./src/config/logger";
import configurations from "./src/config/configurations";

import cors from "cors";

const app = express();

import indexRouter from './src/routes';
import usersRouter from './src/routes/countries.routes';
import authRouter from "./src/routes/auth.routes";

app.use(cors());
// create a rotating write stream
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

AppDataSource.initialize().then(connection => {
  const config = configurations();

  app.use('/', indexRouter);
  app.use('/auth', authRouter);
  app.use('/countries', usersRouter);

  app.listen(config.port, () => {
    console.log("info", "Server is running");
  });
}).catch(error => {
  logger.log("error", "Error connecting to database: " + JSON.stringify(error));
});
