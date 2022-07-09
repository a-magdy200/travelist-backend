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
import { IsInt, IsString, Length } from "class-validator";
import { Country } from './Country.entity'

@Entity()
export class Hotel extends BaseEntity {
	@PrimaryGeneratedColumn()
	id?: number

	@Column()
	@Length(3)
	@IsString()
	name?: string

	@Column()
	@Length(3)
	@IsString()
	address?: string

	@Column({ type: 'int' })
	@IsInt()
	stars?: number

	@ManyToOne(() => Country, (country) => country.hotels)
	@JoinColumn()
	country: Country

	@Column({ default: '' })
	@IsString()
	cover_picture?: string

	@CreateDateColumn()
	created_at?: Date

	@UpdateDateColumn()
	updated_at?: Date

	@DeleteDateColumn()
	deleted_at?: Date
}
