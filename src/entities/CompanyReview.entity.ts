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
import { Company } from './Company.entity'

@Entity('company_review')
export class CompanyReview extends BaseEntity {
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

	@ManyToOne(() => Traveler, (traveler) => traveler.companies_reviews)
	@JoinColumn()
	traveler: Traveler

	@Column({
		type: 'int'
	})
	@IsInt()
	@IsPositive()
	companyId: number;

	@ManyToOne(() => Company, (company) => company.reviews)
	@JoinColumn()
	company: Company

	@CreateDateColumn()
	created_at: Date

	@UpdateDateColumn()
	updated_at: Date

	@DeleteDateColumn()
	deleted_at: Date
}
