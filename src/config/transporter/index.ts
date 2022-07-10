import nodemailer from 'nodemailer'
import configurations from '../configurations'
const config = configurations()
const transporter = nodemailer.createTransport({
	host: config.email.host,
	port: config.email.port,
	secure: config.email.secure,
	requireTLS: config.email.requireTLS,
	auth: {
		user: config.email?.auth?.user,
		pass: config.email?.auth?.pass,
	},
	logger: config.email.logger,
})
export default transporter
