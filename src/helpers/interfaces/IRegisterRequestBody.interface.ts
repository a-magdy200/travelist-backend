import { ITravelerRequestBodyInterface } from './ITravelerRequestBody.interface'
import { IUserRequestBodyInterface } from './IUserRequestBody.interface'
import { ICompanyRequestBodyInterface } from './ICompanyRequestBody.interface'

export interface IRegisterRequestBody
	extends ITravelerRequestBodyInterface,
		IUserRequestBodyInterface,
		ICompanyRequestBodyInterface {}
