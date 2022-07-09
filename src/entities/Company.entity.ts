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
	JoinTable, DeleteDateColumn
} from "typeorm";
import { Program } from './Program.entity'
import { User } from './User.entity'
import { IsInt, IsNumber, IsString, Length } from "class-validator";
import { Traveler } from './Traveler.entity'

@Entity()
export class Company extends BaseEntity {
	@PrimaryGeneratedColumn()
	id?: number


	@Column({ default: '' })
	@Length(10)
	@IsString()
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

	@ManyToMany(() => Traveler, (traveler) => traveler.rating_company)
	@JoinTable()
	rating_travelers: Traveler[]

	@Column({ default: '' })
	@IsString()
	cover_picture?: string

	@OneToOne(() => User)
	@JoinColumn()
	user: User

	@OneToMany(() => Program, (program) => program.company)
	programs?: Program[]

	@CreateDateColumn()
	created_at?: Date

	@UpdateDateColumn()
	updated_at?: Date

	@DeleteDateColumn()
	deleted_at?: Date
}
