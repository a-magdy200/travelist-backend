import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn, JoinColumn, DeleteDateColumn
} from "typeorm";
import { IsDate, IsIn, IsInt, IsString, Length } from "class-validator";
import { Program } from './Program.entity'
import { User } from './User.entity'
import { Country } from './Country.entity'
import { Traveler } from './Traveler.entity'

@Entity()
export class Cycle extends BaseEntity {
	@PrimaryGeneratedColumn()
	id?: number

	@Column()
	@Length(3)
	@IsString()
	name?: string

	@Column({
		type: "int",
		default: 0,
	})
	@IsInt()
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


	@ManyToOne(() => Program, (program) => program.cycles, {
		onUpdate: 'CASCADE',
	})
	@JoinColumn()
	program?: Program

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

	@ManyToMany(() => Traveler, (traveler) => traveler.cycles)
	@JoinTable()
	travelers?: Traveler[]


  @CreateDateColumn()
  created_at?: Date

  @UpdateDateColumn()
  updated_at?: Date

  @DeleteDateColumn()
  deleted_at?: Date
}
