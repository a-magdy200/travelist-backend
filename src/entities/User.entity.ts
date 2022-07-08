import {
	BaseEntity,
	Column,
	Entity,
	PrimaryGeneratedColumn,
	ManyToMany,
	JoinTable,OneToOne,Relation
} from 'typeorm'
import { Company } from './Company.entity'
export type UserType = 'traveler' | 'company'

@Entity()
export class User extends BaseEntity {
	@PrimaryGeneratedColumn()
	id?: number

	@Column()
	name?: string

	@Column({ unique: true })
	email?: string

	@Column()
	password?: string

	@Column()
	address?: string

	@Column({ default: '' })
	profile_picture?: string

	@Column({
		type: 'enum',
		enum: ['traveler', 'company'],
		default: 'traveler',
	})
	type!: UserType
	
	// @OneToOne(() => Company, (company) => company.id)
    // metadata: Relation<Company>

	@ManyToMany((type) => User)
	@JoinTable()
	friends: User[]
}
