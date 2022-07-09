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
	ManyToMany,
	JoinTable,
} from 'typeorm'
import { Program } from './Program.entity'
import { User } from './User.entity'
import { IsInt, IsNumber, Length } from 'class-validator'
import { Traveler } from './Traveler.entity'

@Entity()
export class Company extends BaseEntity {
	@PrimaryGeneratedColumn()
	id?: number

	@CreateDateColumn({ name: 'created_at' })
	createdAt?: Date

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt?: Date

	@Column({ default: '' })
	@Length(3)
	description?: string

	@Column({ default: 0, type: 'int' })
	@IsInt()
	total_rate?: number

	@Column({ default: 0, type: 'int' })
	@IsInt()
	ratings_count?: number

	@Column({ default: 0, type: 'float' })
	@IsNumber()
	average_rate?: number

	@ManyToMany(() => Traveler, (traveler) => traveler.rating_company, {})
	@JoinTable()
	rating_travelers: Traveler[]

	@Column({ default: '' })
	cover_picture?: string

	@OneToOne(() => User)
	@JoinColumn()
	user: User

	@OneToMany(() => Program, (program) => program.company, {})
	programs?: Program[]
}
