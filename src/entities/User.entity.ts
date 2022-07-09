import {
	BaseEntity,
	Column,
	Entity,
	PrimaryGeneratedColumn,
	ManyToMany,
	JoinTable,
} from 'typeorm'
import { Group } from "./Group.entity";
import { Country } from "./Country.entity";

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

	@ManyToMany((type) => User)
	@JoinTable()
	friends: User[]

	@ManyToMany(() => Group, group => group.followers)
	@JoinTable()
	groups: Group[];
}
