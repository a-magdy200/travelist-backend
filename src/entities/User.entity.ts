import {
	BaseEntity,
	Column,
	Entity,
	PrimaryGeneratedColumn,
	ManyToMany,
	JoinTable,
} from 'typeorm'
import { Group } from './Group.entity'
import { IsEnum, Length } from 'class-validator'
import { UserTypeEnum } from '../helpers/enums/userType.enum'

export type UserType = 'traveler' | 'company'

@Entity()
export class User extends BaseEntity {
	@PrimaryGeneratedColumn()
	id?: number

	@Column()
	@Length(3)
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
		enum: UserTypeEnum,
		default: UserTypeEnum.TRAVELER,
	})
	@IsEnum(UserTypeEnum)
	type: UserType

	@ManyToMany(() => Group, (group) => group.followers, {})
	@JoinTable()
	groups: Group[]

	@ManyToMany(() => User, (user) => user.reported_users, {})
	@JoinTable()
	reported_users: User[]

	@ManyToMany(() => User, (user) => user.blocked_users, {})
	@JoinTable()
	blocked_users: User[]
}
