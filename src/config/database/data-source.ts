import { DataSource } from 'typeorm'
import configurations from '../configurations'
const config = configurations()
export const AppDataSource = new DataSource({
	type: 'mysql',
	host: config.database.host,
	port: config.database.port,
	username: config.database.username,
	password: config.database.password,
	database: config.database.name,
	synchronize: true,
	logging: false,
	entities: ['**/entities/*.ts'],
})
