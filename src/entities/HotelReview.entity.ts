import {
	BaseEntity,
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'
import { Hotel } from './Hotel.entity'
import { Traveler } from './Traveler.entity'
import { IsInt, IsPositive, IsString, Max, Min } from 'class-validator'

@Entity('hotel_reviews')
export class HotelReview extends BaseEntity {
	@PrimaryGeneratedColumn()
	id?: number

	@Column({
		type: 'int',
		default: 1,
	})
	@IsInt()
	@Min(1)
	@Max(5)
	rating: number

	@Column({
		type: 'longtext',
	})
	@IsString()
	review: string

	@Column({
		type: 'int'
	})
	@IsInt()
	@IsPositive()
	travelerId: number;

	@Column({
		type: 'int'
	})
	@IsInt()
	@IsPositive()
	hotelId: number;
	

	@ManyToOne(() => Traveler, (traveler) => traveler.hotels_reviews)
	@JoinColumn()
	traveler: Traveler

	@ManyToOne(() => Hotel, (hotel) => hotel.reviews)
	@JoinColumn()
	hotel: Hotel

	@CreateDateColumn()
	created_at: Date

	@UpdateDateColumn()
	updated_at: Date

	@DeleteDateColumn()
	deleted_at: Date
}
