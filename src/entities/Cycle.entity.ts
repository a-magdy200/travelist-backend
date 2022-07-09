import {
	BaseEntity,
	Column,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	ManyToMany,
	JoinTable,
	CreateDateColumn,
	UpdateDateColumn, JoinColumn
} from "typeorm";
import { IsDate, IsIn, IsInt, Length } from 'class-validator'
import { Program } from './Program.entity'
import { User } from './User.entity'
import { Country } from './Country.entity'
import { Traveler } from './Traveler.entity'

@Entity()
export class Cycle extends BaseEntity {
	@PrimaryGeneratedColumn()
	id?: number

	@Column()
	name?: string

	@Column()
	max_seats?: number

	@Column({ type: 'int', default: 0 })
	@IsInt()
	current_seats?: number

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

	@CreateDateColumn({ name: 'created_at' })
	createdAt?: Date

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt?: Date

	@ManyToOne(() => Program, (program) => program.cycles, {
		onUpdate: 'CASCADE',
	})
	@JoinColumn()
	program?: Program

	@Column()
	@Length(3)
	departure_location?: string

	@Column()
	@Length(3)
	return_location?: string

	@Column()
	@Length(3)
	arrival_location?: string

	@Column()
	@Length(3)
	return_arrival_location?: string

	@ManyToMany(() => Traveler, (traveler) => traveler.cycles, {})
	@JoinTable()
	travelers?: Traveler[]
}
