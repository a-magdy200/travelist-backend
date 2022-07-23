import {
	BaseEntity,
	Column,
	Entity,
	PrimaryGeneratedColumn,
	ManyToMany,
	JoinTable,
	OneToMany,
	CreateDateColumn,
	UpdateDateColumn,
	DeleteDateColumn,
	OneToOne,
	JoinColumn,
} from 'typeorm'
import { Group } from './Group.entity'
import { IsBoolean, IsEmail, IsEnum, IsString, Length } from 'class-validator'
import { UserTypeEnum } from '../helpers/enums/userType.enum'
import { Notification } from './Notification.entity'
import { ChatMessage } from './ChatMessage.entity'
import { ChatUser } from './ChatUser.entity'
import { SupportTicket } from './SupportTicket.entity'
import { SupportTicketResponse } from './SupportTicketResponse.entity'
import { AccountStatusEnum } from '../helpers/enums/accountStatus.enum'
import { UserReport } from './UserReport.entity'
import { PostReport } from './PostReport.entity'
import { Company } from './Company.entity'
import { Traveler } from './Traveler.entity'
import { Transaction } from './Transaction.entity'

@Entity('users')
export class User extends BaseEntity {
	@PrimaryGeneratedColumn()
	id?: number

	@Column()
	@Length(3)
	@IsString()
	name: string

	@Column({ unique: true })
	@IsEmail()
	email: string

	@Column({select: false})
	@Length(6)
	@IsString()
	password: string

	@Column({default: ''})
	@IsString()
	@Length(3)
	address?: string

	@Column({ default: '' })
	@IsString()
	profile_picture?: string

	@Column({
		type: 'enum',
		enum: UserTypeEnum,
		default: UserTypeEnum.TRAVELER,
	})
	@IsEnum(UserTypeEnum)
	type: UserTypeEnum

	@Column({
		type: 'boolean',
		default: false,
	})
	@IsBoolean()
	is_verified: boolean

	@Column({
		type: 'enum',
		enum: AccountStatusEnum,
		default: AccountStatusEnum.ACTIVE,
	})
	@IsEnum(AccountStatusEnum)
	status: AccountStatusEnum

	@Column({ default: '', nullable:true })
	@IsString()
	forgot_password_token?: string

	@OneToMany(() => PostReport, (postReport) => postReport.user)
	post_reports: PostReport[]

	@OneToOne(() => Traveler, (traveler) => traveler.user)
	traveler: Traveler

	@OneToOne(() => Company, (company) => company.user)
	company: Company

	@OneToMany(() => Notification, (notification) => notification.user)
	notifications: Notification[]

	@OneToMany(() => SupportTicket, (supportTicket) => supportTicket.user)
	tickets: SupportTicket[]

	@OneToMany(
		() => SupportTicketResponse,
		(supportTicketResponse) => supportTicketResponse.user
	)
	supportTicketsResponses: SupportTicketResponse[]

	@OneToMany(() => ChatMessage, (message) => message.user)
	messages: ChatMessage[]

	@OneToMany(() => ChatUser, (chat) => chat.user)
	chats: ChatUser[]

	@ManyToMany(() => Group, (group) => group.followers)
	@JoinTable({
		name: 'group_follower',
	})
	groups: Group[]

	@OneToMany(() => UserReport, (user) => user.reporter_user)
	reported_users: UserReport[]

	@OneToMany(() => UserReport, (user) => user.reported_user)
	reports: UserReport[]

	@ManyToMany(() => User, (user) => user.blocked_users)
	@JoinTable({
		name: 'blocked_users',
	})
	blocked_users: User[]

	@OneToMany(() => Transaction, (transaction) => transaction.user)
	transactions: Transaction[]

	@CreateDateColumn()
	created_at?: Date

	@UpdateDateColumn()
	updated_at?: Date

	@DeleteDateColumn()
	deleted_at?: Date
}
