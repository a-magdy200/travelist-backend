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
	JoinColumn,
	DeleteDateColumn,
} from 'typeorm'
import { Company } from './Company.entity'
import { Cycle } from './Cycle.entity'
import { Hotel } from './Hotel.entity'
import { Transportation } from './Transportation.entity'
import { Country } from './Country.entity'
import {
	IsBoolean,
	IsInt,
	IsNumber,
	IsString,
	Length,
	Max,
	Min,
} from 'class-validator'

@Entity('programs')
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

	@Column({ default: '' })
	@IsString()
	cover_picture?: string

	@Column({ nullable: false, type: 'float', default: 0.0 })
	@IsNumber()
	@Min(0)
	price?: number

	@Column({ type: 'boolean', default: false })
	@IsBoolean()
	is_Recurring?: boolean

	@Column({ default: 0, type: 'int' })
	@IsInt()
	@Min(0)
	total_rate?: number

	@Column({ default: 0, type: 'int' })
	@IsInt()
	@Min(0)
	ratings_count?: number

	@Column({ default: 0, type: 'float' })
	@IsNumber()
	@Min(0)
	@Max(5)
	average_rate?: number

	@Column({
		type: "int",
		nullable: true,
	  })
	 companyId: number
	@ManyToOne(() => Company, (company) => company.programs, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	@JoinColumn()
	company: Company

	@OneToMany(() => Cycle, (cycle) => cycle.program,   )
	cycles?: Cycle[]

	@ManyToOne(
		() => Transportation,
		(transportation) => transportation.programs,
		{ onDelete: 'CASCADE' }
	)
	@JoinColumn()
	transportation?: Transportation

	@ManyToOne(() => Country, (country) => country.programs,{ onDelete: 'CASCADE' })
	@JoinColumn()
	country: Country

	@ManyToMany(() => Country,{ onDelete: 'CASCADE' })
	@JoinTable({
		name: 'program_destination',
	})
	destinations: Country[]

	@ManyToMany(() => Hotel, hotel => hotel.programs,{ onDelete: 'CASCADE' })
	hotels?: Hotel[]

	@CreateDateColumn()
	created_at?: Date

	@UpdateDateColumn()
	updated_at?: Date

	@DeleteDateColumn()
	deleted_at?: Date
}
