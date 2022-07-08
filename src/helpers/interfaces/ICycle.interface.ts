import {ICountryInterface} from "./ICountry.interface";

export interface ICycleInterface {
    id?:number;
    name?:string;
    max_seats?:number;
    current_seats?:number;
    departure_date?:Date;
    arrival_date?:Date;
    return_date?:Date;
    return_arrival_date?:Date;
    departureLocationId?:number;
    returnLocationId?:number;
    arrivalLocationId?:number;
    returnArrivalLocationId?:number;
    programId:number;
  }
  