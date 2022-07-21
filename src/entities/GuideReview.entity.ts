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

@Entity('guide_reviews')
export class GuideReview extends BaseEntity {
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
	guideId: number;

	@ManyToOne(() => Traveler, (traveler) => traveler.guide_reviews)
	@JoinColumn()
	traveler: Traveler

	@ManyToOne(() => Traveler, (traveler) => traveler.reviews)
	@JoinColumn()
	guide: Traveler

	@CreateDateColumn()
	created_at: Date

	@UpdateDateColumn()
	updated_at: Date

	@DeleteDateColumn()
	deleted_at: Date
}
