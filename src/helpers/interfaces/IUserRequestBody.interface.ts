import { UserType } from '../types/user.type'

export interface IUserRequestBodyInterface {
	name: string
	email: string
	password: string
	address: string
	profile_picture?: string
	type: UserType
}
