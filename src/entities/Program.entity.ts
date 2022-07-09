import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	BaseEntity,
	OneToMany,
	ManyToMany,
	JoinTable,
	CreateDateColumn,
	UpdateDateColumn,
	JoinColumn, DeleteDateColumn
} from "typeorm";
import { Company } from './Company.entity'
import { Cycle } from './Cycle.entity'
import { Hotel } from './Hotel.entity'
import { Transportation } from './Transportation.entity'
import { Country } from './Country.entity'
import { IsBoolean, IsInt, IsNumber, IsString, Length } from "class-validator";

@Entity()
export class Program extends BaseEntity {
	@PrimaryGeneratedColumn()
	id?: number

	@Column()
	@Length(3)
	@IsString()
	name?: string

	@Column()
	@Length(10)
	@IsString()
	description?: string

	@Column({default: ''})
	@IsString()
	cover_picture?: string

	@Column({ nullable: false, type: 'float', default: 0.0 })
	@IsNumber()
	price?: number

	@Column({ type: 'boolean', default: false })
	@IsBoolean()
	is_Recurring?: boolean

	@Column({ type: 'int', default: 0 })
	@IsInt()
	total_rating_value?: number

	@Column({ type: 'int', default: 0 })
	@IsInt()
	total_rating_users?: number

	@Column({ type: 'int', default: 0 })
	@IsNumber()
	average_rating?: number

	@ManyToOne(() => Company, (company) => company.programs, {
		onDelete: 'CASCADE',
	})
	@JoinColumn()
	company?: Company

	@OneToMany(() => Cycle, (cycle) => cycle.program, { onDelete: 'CASCADE' })
	cycles?: Cycle[]

	@ManyToOne(
		() => Transportation,
		(transportation) => transportation.programs,
		{ onDelete: 'CASCADE' }
	)
	@JoinColumn()
	transportation?: Transportation

	@OneToMany(() => Country, (country) => country.programs)
	@JoinColumn()
	country: Country
	@ManyToMany(() => Country, (country) => country.program_destination)
	@JoinTable()
	destinations: Country[]

	@ManyToMany((hotel) => Hotel, { onDelete: 'CASCADE' })
	@JoinTable()
	hotels?: Hotel[]

	@CreateDateColumn()
	created_at?: Date

	@UpdateDateColumn()
	updated_at?: Date

	@DeleteDateColumn()
	deleted_at?: Date
}
