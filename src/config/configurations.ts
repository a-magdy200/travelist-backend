import * as dotenv from 'dotenv'
import { IConfigInterface } from '../helpers/interfaces/IConfig.interface'
dotenv.config()
export default (): IConfigInterface => ({
	port: process.env.PORT ? parseInt(process.env.PORT, 10) || 4000 : 4000,
	database: {
		host: process.env.DATABASE_HOST,
		port: process.env.DATABASE_PORT
			? parseInt(process.env.DATABASE_PORT, 10) || 3306
			: 3306,
		username: process.env.DATABASE_USER,
		password: process.env.DATABASE_PASS,
		name: process.env.DATABASE_NAME,
	},
	secret: process.env.SECRET_KEY ?? 'travelist',
	reset_password_key: process.env.RESET_PASSWORD_KEY ?? 'travel',
	websiteUrl: process.env.WEBSITE_URL ?? 'http://localhost:3000',
	email: {
		host: process.env.EMAIL_HOST,
		port: process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT, 10) : 465,
		secure: process.env.EMAIL_IS_SECURE === '1',
		requireTLS: process.env.EMAIL_REQUIRE_TLS === '1',
		auth: {
			user: process.env.EMAIL_AUTH_USER,
			pass: process.env.EMAIL_AUTH_PASSWORD,
		},
		logger: process.env.EMAIL_LOGGER === '1',
	},
})
