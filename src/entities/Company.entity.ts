import {
	BaseEntity,
	Entity,
	Column,
	PrimaryGeneratedColumn,
	OneToMany,
	CreateDateColumn,
	UpdateDateColumn,
	OneToOne,
	JoinColumn,
	DeleteDateColumn,
} from 'typeorm'
import { Program } from './Program.entity'
import { User } from './User.entity'
import { IsInt, IsNumber, IsString, Length, Max, Min } from 'class-validator'
import { CompanyReview } from './CompanyReview.entity'

@Entity('companies')
export class Company extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ default: '' })
	@Length(10)
	@IsString()
	description?: string

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


	@Column({
		type: "int"
	})
	@IsInt()
	userId: number;

	@Column({ default: '' })
	@IsString()
	cover_picture?: string

	@OneToOne(() => User, (user) => user.company,{
		onUpdate: 'CASCADE',
		onDelete: 'CASCADE' 
		})
	@JoinColumn()
	user: User

	@OneToMany(() => Program, (program) => program.company)
	programs?: Program[]

	@OneToMany(() => CompanyReview, (companyReview) => companyReview.company)
	reviews: CompanyReview[]

	@CreateDateColumn()
	created_at?: Date

	@UpdateDateColumn()
	updated_at?: Date

	@DeleteDateColumn()
	deleted_at?: Date
}
