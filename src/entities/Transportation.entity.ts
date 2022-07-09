import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'
import { Program } from './Program.entity'
import { Length } from 'class-validator'

@Entity()
export class Transportation extends BaseEntity {
	@PrimaryGeneratedColumn()
	id?: number

	@Column()
	@Length(3)
	name?: string

	@OneToMany(() => Program, (program) => program.transportation, {})
	programs?: Program[]

	@CreateDateColumn({ name: 'created_at' })
	createdAt?: Date

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt?: Date
}
