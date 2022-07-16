import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import 'reflect-metadata'
import { AppDataSource } from './src/config/database/data-source'
import logger from './src/config/logger'
import configurations from './src/config/configurations'
import hotelsRoutes from './src/routes/hotels.routes'
import userRouter from './src/routes/user.routes'
import travelerRouter from './src/routes/traveler.routes'
import authRouter from './src/routes/auth.routes'
import countryRouter from './src/routes/countries.routes';
import cycleRoutes from "./src/routes/cycle.routes";
import companyRoutes from "./src/routes/company.routes";
import appRoutes from "./src/routes/app.routes";
import programsRoutes from "./src/routes/programs.routes";
import groupRoutes from "./src/routes/group.routes";

const app = express()
app.use(cors({ origin: true, credentials: true }))

// create a rotating write stream
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'uploads')))

AppDataSource.initialize()
	.then((connection) => {
		const config = configurations()
		// app.use('/', indexRouter);
		app.use('/auth', authRouter)
		app.use('/api/companies', companyRoutes)
		app.use('/api/hotels', hotelsRoutes)
		app.use('/api/users', userRouter)
		app.use('/api/travelers', travelerRouter)
		app.use('/api/countries', countryRouter)
		app.use('/', appRoutes)
		app.use('/cycles', cycleRoutes)
		app.use('/programs', programsRoutes)
		app.use('/api/groups', groupRoutes)

		app.listen(config.port, () => {
			console.log(`Server running on PORT: ${config.port}`)
		})
	})
	.catch((error) => {
		logger.log(
			'error',
			'Error connecting to database: ' + JSON.stringify(error)
		)
	})
