export interface ICycleInterface {
	id?: number
	name?: string
	max_seats: number
	current_seats?: number
	departure_date?: Date
	arrival_date?: Date
	return_date?: Date
	return_arrival_date?: Date
	departure_location?: string
	arrival_location?: string
	return_location?: string
	return_arrival_location?:string
	programId: number
}
