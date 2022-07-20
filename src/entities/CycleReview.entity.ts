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
import { Cycle } from './Cycle.entity'

@Entity('cycle_reviews')
export class CycleReview extends BaseEntity {
	@PrimaryGeneratedColumn()
	id?: number

	@Column({
		type: 'int',
		default: 0,
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

	@ManyToOne(() => Traveler, (traveler) => traveler.cycles_reviews)
	@JoinColumn()
	traveler: Traveler

	@Column({
		type: 'int'
	})
	@IsInt()
	@IsPositive()
	cycleId: number;

	@ManyToOne(() => Cycle, (cycle) => cycle.reviews)
	@JoinColumn()
	cycle: Cycle

	@CreateDateColumn()
	created_at: Date

	@UpdateDateColumn()
	updated_at: Date

	@DeleteDateColumn()
	deleted_at: Date
}
