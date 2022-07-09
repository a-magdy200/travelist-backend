import {
	BaseEntity,
	Column,
	CreateDateColumn, DeleteDateColumn,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from "typeorm";
import { Program } from './Program.entity'
import { Length } from 'class-validator'

@Entity()
export class Transportation extends BaseEntity {
	@PrimaryGeneratedColumn()
	id?: number

	@Column()
	@Length(3)
	name?: string

	@OneToMany(() => Program, (program) => program.transportation)
	programs?: Program[]

	@CreateDateColumn()
	created_at?: Date

	@UpdateDateColumn()
	updated_at?: Date

	@DeleteDateColumn()
	deleted_at?: Date
}
