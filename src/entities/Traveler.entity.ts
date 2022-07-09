import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BaseEntity,
	OneToOne,
	JoinColumn,
	ManyToMany,
	JoinTable,
	Unique,
	OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn
} from "typeorm";
import { User } from './User.entity'
import { IsBoolean, IsDate, IsEnum, IsString, Length } from "class-validator";
import { Company } from './Company.entity'
import { Post } from './Post.entity'
import { GenderEnum } from '../helpers/enums/gender.enum'
import { GenderType } from '../helpers/types/gender.type'
import { Cycle } from './Cycle.entity'
import { FriendRequest } from './FriendRequest.entity'

@Entity()
export class Traveler extends BaseEntity {
	@PrimaryGeneratedColumn()
	id?: number

	@Column({ unique: true, nullable: true })
	@Length(14, 14)
	@IsString()
	national_id?: string

	@Column({
		type: 'enum',
		enum: GenderEnum,
		default: GenderEnum.MALE,
	})
	@IsEnum(GenderEnum)
	gender: GenderType

	@Column({ type: 'date' })
	@IsDate()
	date_of_birth?: Date

	@Column({ default: false, type: 'boolean' })
	@IsBoolean()
	is_guide?: boolean

	@ManyToMany(() => Company, (company) => company.rating_travelers)
	@JoinTable()
	rating_company: Company[]

	@OneToMany(() => FriendRequest, (friend_request) => friend_request.sender)
	sent_requests: FriendRequest[]

	@OneToMany(
		() => FriendRequest,
		(friend_request) => friend_request.receiver,
		{}
	)
	received_requests: FriendRequest[]

	@OneToMany(() => Post, (post) => post.traveler)
	posts: Post[]

	@ManyToMany(() => Traveler)
	@JoinTable()
	friends: Traveler[]

	@OneToOne(() => User)
	@JoinColumn()
	user: User

	@ManyToMany(() => Cycle, (cycle) => cycle.travelers)
	@JoinTable()
	cycles: Cycle[]

	@CreateDateColumn()
	created_at?: Date

	@UpdateDateColumn()
	updated_at?: Date

	@DeleteDateColumn()
	deleted_at?: Date
}
