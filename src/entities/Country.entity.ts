import {
	BaseEntity,
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	JoinColumn,
	JoinTable,
	ManyToMany,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'
import { Group } from './Group.entity'
import { IsInt, IsPositive, IsString, Length, Max, Min } from "class-validator";
import { Hotel } from './Hotel.entity'
import { Program } from './Program.entity'
import { CountryReview } from './CountryReview.entity'

@Entity('countries')
export class Country extends BaseEntity {
	@PrimaryGeneratedColumn()
	id?: number

	@Column()
	@Length(3)
	@IsString()
	name?: string

	@Column({ type: 'int', default: 0 })
	@IsInt()
	@Min(0)
	total_rate: number

	@Column({ type: 'float', default: 0 })
	@IsInt()
	@Min(0)
	@Max(5)
	average_rate: number

	@Column({ type: 'int', default: 0 })
	@IsInt()
	@Min(0)
	ratings_count: number

	@Column({ type: 'int', default: null, nullable: true })
	@IsInt()
	@IsPositive()
	groupId: number

	@OneToMany(() => Program, (program) => program.country)
	@JoinColumn()
	programs: Program[]

	@OneToMany(() => CountryReview, (countryReview) => countryReview.country)
	@JoinColumn()
	reviews: CountryReview[]


	@OneToMany(() => Hotel, (hotel) => hotel.country)
	hotels: Hotel[]

	@OneToOne(() => Group, (group) => group.country)
	@JoinColumn()
	group?: Group

	@CreateDateColumn()
	created_at?: Date

	@UpdateDateColumn()
	updated_at?: Date

	@DeleteDateColumn()
	deleted_at?: Date
}
