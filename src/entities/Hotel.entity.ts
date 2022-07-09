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
import { Length } from 'class-validator'
import { Country } from './Country.entity'

@Entity()
export class Hotel extends BaseEntity {
	@PrimaryGeneratedColumn()
	id?: number

	@Column()
	@Length(3)
	name?: string

	@Column()
	@Length(3)
	address?: string

	@Column({ type: 'int' })
	stars?: number

	@ManyToOne(() => Country, (country) => country.hotels, {})
	@JoinColumn()
	country: Country

	@Column({ default: '' })
	cover_picture?: string

	@CreateDateColumn()
	created_at?: Date

	@UpdateDateColumn()
	updated_at?: Date

	@DeleteDateColumn()
	deleted_at?: Date
}
