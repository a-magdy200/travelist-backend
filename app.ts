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
import friendRequestRoutes from './src/routes/friend_request.routes'
import hotelReviewsRoutes from "./src/routes/hotel_reviews.routes";
import countryReviewsRoutes from "./src/routes/country_reviews.routes";
import cycleReviewsRoutes from "./src/routes/cycle_reviews.routes";
import guideReviewsRoutes from "./src/routes/guide_reviews.routes";
import companyReviewsRoutes from "./src/routes/company_reviews.routes";
import postRoutes from './src/routes/post.routes'
import postReportsRoutes from './src/routes/post_reports.routes'
import adminRoutes from './src/routes/admin/admin.routes'
import searchRouter from './src/routes/search.routes';
import {createServer} from "http";
import { Server } from "socket.io";
import socketHandler from "./src/controllers/socket_handler";
import createDirectories from "./src/helpers/functions/createDirectories";
import {mkdirSync} from "fs";
const app = express()
const server = createServer(app);
export const io = new Server(server, {
	cors: {origin: true}
});

app.use(cors({ origin: true, credentials: true }))
// create a rotating write stream
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'uploads')))

// io.on("connection", function(socket: any) {
// 	console.log("a user connected");
// 	console.log(socket.id);
//   });


AppDataSource.initialize()
	.then((connection) => {
		const config = configurations()
		// app.use('/', indexRouter);
		createDirectories();
		app.use('/auth', authRouter)
		app.use('/api/companies', companyRoutes)
		app.use('/api/hotels', hotelsRoutes)
		app.use('/api/admin', adminRoutes)
		app.use('/api/users', userRouter)
		app.use('/api/travelers', travelerRouter)
		app.use('/api/countries', countryRouter)
		app.use('/', appRoutes)
		app.use('/api/cycles', cycleRoutes)
		app.use('/api/programs', programsRoutes)
		app.use('/api/groups', groupRoutes)
		app.use('/api/friendrequests', friendRequestRoutes)
		app.use('/api/hotel_reviews', hotelReviewsRoutes)
		app.use('/api/country_reviews', countryReviewsRoutes)
		app.use('/api/cycle_reviews', cycleReviewsRoutes)
		app.use('/api/guide_reviews', guideReviewsRoutes)
		app.use('/api/company_reviews', companyReviewsRoutes)
		app.use('/api/search', searchRouter)
		app.use('/api/posts', postRoutes)
		app.use('/api/posts_reports', postReportsRoutes)
		socketHandler(io)
		server.listen(config.port, () => {
			console.log(`Server running on PORT: ${config.port}`)
		})
	})
	.catch((error) => {
		logger.log(
			'error',
			'Error connecting to database: ' + JSON.stringify(error)
		)
	})
