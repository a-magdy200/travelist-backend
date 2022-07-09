import { GenderType } from '../types/gender.type'
import { UserType } from '../types/user.type'

export interface IRegisterRequestBody {
	name: string
	email: string
	password: string
	address: string
	profile_picture: string
	type: UserType
	national_id: string
	gender: GenderType
	date_of_birth: Date
	is_guide: boolean
	description: string
	// userId: number,
}
