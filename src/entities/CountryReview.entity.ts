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
import { Traveler } from './Traveler.entity'
import { IsInt, IsString, Max, Min,IsPositive } from 'class-validator'
import { Country } from './Country.entity'

@Entity('country_reviews')
export class CountryReview extends BaseEntity {
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

	@Column({ type: 'int', default: null, nullable: true })
	@IsInt()
	@IsPositive()
	travelerId: number

	@Column({ type: 'int', default: null, nullable: true })
	@IsInt()
	@IsPositive()
	countryId: number

	@ManyToOne(() => Traveler, (traveler) => traveler.country_reviews)
	@JoinColumn()
	traveler: Traveler

	@ManyToOne(() => Country, (country) => country.reviews)
	@JoinColumn()
	country: Country

	@CreateDateColumn()
	created_at: Date

	@UpdateDateColumn()
	updated_at: Date

	@DeleteDateColumn()
	deleted_at: Date
}
