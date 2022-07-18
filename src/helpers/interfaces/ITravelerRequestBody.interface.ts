import { GenderType } from '../types/gender.type'

export interface ITravelerRequestBodyInterface {
	national_id: string
	gender: GenderType
	date_of_birth: Date
	is_guide: string
}
