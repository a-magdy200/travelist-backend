import {
	BaseEntity,
	Column,
	CreateDateColumn, DeleteDateColumn,
	Entity,
	JoinColumn,
	JoinTable,
	ManyToMany,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from "typeorm";
import { Cycle } from './Cycle.entity'
import { Group } from './Group.entity'
import { IsInt, IsString, Length } from "class-validator";
import { User } from './User.entity'
import { Hotel } from './Hotel.entity'
import { Program } from './Program.entity'

@Entity()
export class Country extends BaseEntity {
	@PrimaryGeneratedColumn()
	id?: number

	@Column()
	@Length(3)
	@IsString()
	name?: string

	@ManyToOne(() => Program, (program) => program.country)
	@JoinColumn()
	programs: Program[]

	@ManyToMany(() => Program, (program) => program.destinations)
	program_destination: Program[]

	@OneToMany(() => Hotel, (hotel) => hotel.country)
	hotels: Hotel[]

	@OneToOne(() => Group, (group) => group.country)
	@JoinColumn()
	group: Group

	@Column({ type: 'int', default: 0 })
	@IsInt()
	total_rate: number

	@Column({ type: 'float', default: 0 })
	@IsInt()
	average_rate: number

	@Column({ type: 'int', default: 0 })
	@IsInt()
	ratings_count: number

	@CreateDateColumn()
	created_at?: Date

	@UpdateDateColumn()
	updated_at?: Date

	@DeleteDateColumn()
	deleted_at?: Date
}
