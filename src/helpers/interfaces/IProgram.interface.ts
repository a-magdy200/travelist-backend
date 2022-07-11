import { ICompanyInterface } from './ICompany.interface'
import { ITransportationInterface } from './ITransportation.interface'
import { IHotelInterface } from './IHotel.interface'

export interface IProgramInterface {
	id?: number
	name?: string
	description: string
	price: string
	is_Recurring?: boolean
	transportationId?: string
	companyId?: string
	countryId?:string
	hotels?: string | string[]
	destinations?: string | string[]

}
