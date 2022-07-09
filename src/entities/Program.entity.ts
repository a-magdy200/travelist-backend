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
} from 'typeorm'
import { Company } from './Company.entity'
import { Cycle } from './Cycle.entity'
import { Hotel } from './Hotel.entity'
import { Transportation } from './Transportation.entity'
import { Country } from './Country.entity'

@Entity()
export class Program extends BaseEntity {
	@PrimaryGeneratedColumn()
	id?: number

	@Column()
	name?: string

	@Column()
	description?: string

	@Column()
	cover_picture?: string

	@Column({ nullable: false, type: 'float', default: 0.0 })
	price?: number

	@Column({ type: 'boolean', default: true })
	is_Recurring?: boolean

	@Column({ type: 'int', default: 0 })
	total_rating_value?: number

	@Column({ type: 'int', default: 0 })
	total_rating_users?: number

	@Column({ type: 'int', default: 0 })
	average_rating?: number

	@CreateDateColumn({ name: 'created_at' })
	createdAt?: Date

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt?: Date

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
}
