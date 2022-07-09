import { ICompanyInterface } from "./ICompany.interface"
import { ITransportationInterface } from "./ITransportation.interface"
import { IHotelInterface } from "./IHotel.interface"

export interface IProgramInterface {
    id?:number
    name?: string
    companyId?: string
    description:string
    price: string
    is_Recurring?: boolean
    transportation?: ITransportationInterface
    hotels?:string|string[]
}