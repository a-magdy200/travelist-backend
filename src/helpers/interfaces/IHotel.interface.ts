import { ICountryInterface } from "./ICountry.interface";
import { IProgramInterface } from "./IProgram.interface";

export interface IHotelInterface {
	id?: number
	name: string
	stars: number;
	address: string;
	countryId?: number;
	country?:ICountryInterface;
	programs?:IProgramInterface[];
	countryName?: string;
	programsCount?: number;
}
