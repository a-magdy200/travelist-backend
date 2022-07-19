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
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'
import { IsInt, IsNumber, IsPositive, IsString, Length, Max, Min } from "class-validator";
import { Country } from './Country.entity'
import { HotelReview } from './HotelReview.entity'
import { Program } from './Program.entity'

@Entity('hotels')
export class Hotel extends BaseEntity {
	@PrimaryGeneratedColumn()
	id?: number

	@Column()
	@Length(3)
	@IsString()
	name?: string

	@Column()
	@Length(3)
	@IsString()
	address?: string

	@Column({ type: 'int' })
	@IsInt()
	@Min(1)
	@Max(7)
	stars?: number

	@Column({ default: 0, type: 'int' })
	@IsInt()
	@Min(0)
	total_rate?: number

	@Column({ default: 0, type: 'int' })
	@IsInt()
	@Min(0)
	ratings_count?: number

	@Column({ default: 0, type: 'float' })
	@IsNumber()
	@Min(0)
	@Max(5)
	average_rate?: number

	@Column({ default: '' })
	@IsString()
	cover_picture?: string

	@Column({type: "int"})
	@IsInt()
	@IsPositive()
	countryId: number;

	@OneToMany(() => HotelReview, (hotelReview) => hotelReview.hotel)
	reviews: HotelReview[]

	@ManyToOne(() => Country, (country) => country.hotels)
	@JoinColumn()
	country: Country

	@ManyToMany(() => Program, (program) => program.hotels)
	@JoinTable({
		name: 'program_hotel',
		inverseJoinColumn: {
			name: "program_id",
			referencedColumnName: "id"
		},
		joinColumn: {
			name: "hotel_id",
			referencedColumnName: "id"
		},
	})
	programs: Program[]

	@CreateDateColumn()
	created_at?: Date

	@UpdateDateColumn()
	updated_at?: Date

	@DeleteDateColumn()
	deleted_at?: Date
}
