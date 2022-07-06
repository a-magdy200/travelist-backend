import { createLogger, format, transports, config } from 'winston'

const logger = createLogger({
	transports: [
		new transports.Console(),
		new transports.File({ filename: 'logs.log' }),
	],
})
export default logger
