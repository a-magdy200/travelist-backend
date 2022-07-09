import {
	BaseEntity,
	Column,
	Entity,
	PrimaryGeneratedColumn,
	ManyToMany,
	JoinTable, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn
} from "typeorm";
import { Group } from './Group.entity'
import { IsEnum, IsString, Length } from "class-validator";
import { UserTypeEnum } from '../helpers/enums/userType.enum'
import { Notification } from "./notification.entity";
import { ChatMessage } from "./ChatMessage.entity";
import { ChatUser } from "./ChatUser.entity";
import { SupportTicket } from "./SupportTicket.entity";
import { SupportTicketResponse } from "./SupportTicketResponse.entity";
import { AccountStatusEnum } from "../helpers/enums/accountStatus.enum";
import { User } from "./User.entity";

@Entity()
export class UserReport extends BaseEntity {
	@PrimaryGeneratedColumn()
	id?: number

	@Column({
		type: "longtext"
	})
	@IsString()
	reason: string;

	@ManyToOne(() => User, user => user.reports)
	@JoinColumn()
	reported_user: User;

	@ManyToOne(() => User, user => user.reported_users)
	@JoinColumn()
	reporter_user: User;

	@CreateDateColumn()
	created_at?: Date

	@UpdateDateColumn()
	updated_at?: Date

	@DeleteDateColumn()
	deleted_at?: Date
}
