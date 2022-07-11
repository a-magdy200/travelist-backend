import { IUserInterface } from './IUser.interface'

export interface IUserAuthenticationResponse {
	access_token: string
	user: IUserInterface
}
