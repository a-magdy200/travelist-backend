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
const companyRouter = require('./src/routes/company.routes')
const indexRouter = require('./src/routes')
const programRouter = require('./src/routes/programs.routes')
const cycleRouter = require('./src/routes/cycles.routes');

const app = express()
app.use(
	cors({ origin: true, credentials: true })
)

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
		app.use('/api/companies', companyRouter)
		app.use('/api/hotels', hotelsRoutes)
		app.use('/api/users', userRouter)
		app.use('/api/travelers', travelerRouter)
		app.use('/', indexRouter)
    app.use('/cycles', cycleRouter);
    app.use('/programs', programRouter)
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
