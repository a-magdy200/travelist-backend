import {
	BaseEntity,
	Column,
	Entity,
	PrimaryGeneratedColumn,
	ManyToMany,
	JoinTable, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn
} from "typeorm";
import { Group } from './Group.entity'
import { IsEnum, Length } from 'class-validator'
import { UserTypeEnum } from '../helpers/enums/userType.enum'
import { Notification } from "./notification.entity";
import { ChatMessage } from "./ChatMessage.entity";
import { ChatUser } from "./ChatUser.entity";
import { SupportTicket } from "./SupportTicket.entity";
import { SupportTicketResponse } from "./SupportTicketResponse.entity";
import { AccountStatusEnum } from "../helpers/enums/accountStatus.enum";
import { UserType } from "../helpers/types/user.type";
import { UserReport } from "./UserReport.entity";


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

	@Column({
		type: "boolean",
		default: false
	})
	is_verified: boolean;

	@Column({
		type: "enum",
		enum: AccountStatusEnum,
		default: AccountStatusEnum.ACTIVE
	})
	@IsEnum(AccountStatusEnum)
	status: AccountStatusEnum;

	@OneToMany(() => Notification, notification => notification.user)
	notifications: Notification[];

	@OneToMany(() => SupportTicket, supportTicket => supportTicket.user)
	tickets: SupportTicket[];

	@OneToMany(() => SupportTicketResponse, supportTicketResponse => supportTicketResponse.user)
	supportTicketsResponses: SupportTicketResponse[];

	@OneToMany(() => ChatMessage, message => message.user)
	messages: ChatMessage[];

	@ManyToMany(() => ChatUser, chat => chat.users)
	chats: ChatUser[];

	@ManyToMany(() => Group, (group) => group.followers)
	@JoinTable()
	groups: Group[]

	@OneToMany(() => UserReport, (user) => user.reporter_user)
	reported_users: UserReport[]

	@OneToMany(() => UserReport, (user) => user.reported_user)
	reports: UserReport[]

	@ManyToMany(() => User, (user) => user.blocked_users)
	@JoinTable()
	blocked_users: User[]

	@CreateDateColumn()
	created_at?: Date

	@UpdateDateColumn()
	updated_at?: Date

	@DeleteDateColumn()
	deleted_at?: Date
}
