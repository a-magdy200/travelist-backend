import {
	BaseEntity,
	Column,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	ManyToMany,
	JoinTable,
	CreateDateColumn,
	UpdateDateColumn,
	JoinColumn,
	DeleteDateColumn,
	OneToMany,
} from 'typeorm'
import {
	IsDate,
	IsInt,
	IsNumber,
	IsString,
	Length,
	Max,
	Min,
} from 'class-validator'
import { Program } from './Program.entity'
import { Traveler } from './Traveler.entity'
import { CycleReview } from './CycleReview.entity'
import { CycleBooking } from './CycleBooking'

@Entity('cycles')
export class Cycle extends BaseEntity {
	@PrimaryGeneratedColumn()
	id?: number

	@Column()
	@Length(3)
	@IsString()
	name?: string

	@Column({
		type: 'int',
		default: 0,
	})
	@IsInt()
	@Min(0)
	max_seats: number

	@Column({ type: 'int', default: 0 })
	@IsInt()
	@Min(0)
	current_seats: number

	@Column()
	@IsDate()
	departure_date?: Date

	@Column()
	@IsDate()
	arrival_date?: Date

	@Column()
	@IsDate()
	return_date?: Date

	@Column()
	@IsDate()
	return_arrival_date?: Date

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

	@Column()
	@Length(3)
	@IsString()
	departure_location?: string

	@Column()
	@Length(3)
	@IsString()
	return_location?: string

	@Column()
	@Length(3)
	@IsString()
	arrival_location?: string

	@Column()
	@Length(3)
	@IsString()
	return_arrival_location?: string

	@OneToMany(() => CycleReview, (review) => review.cycle)
	reviews: CycleReview[]

	@OneToMany(() => CycleBooking, (booking) => booking.cycle)
	bookings: CycleBooking[]

	@ManyToOne(() => Program, (program) => program.cycles, {
		onUpdate: 'CASCADE',
		onDelete: 'CASCADE' 
	})
	@JoinColumn()
	program?: Program

	@CreateDateColumn()
	created_at?: Date

	@UpdateDateColumn()
	updated_at?: Date

	@DeleteDateColumn()
	deleted_at?: Date
}
