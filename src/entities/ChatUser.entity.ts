import {
	BaseEntity,
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'
import { User } from './User.entity'
import { IsEnum } from 'class-validator'
import { ChatStatusEnum } from '../helpers/enums/chatStatus.enum'

@Entity('chat_user')
export class ChatUser extends BaseEntity {
	@PrimaryGeneratedColumn()
	id?: number

	@Column({
		type: 'enum',
		enum: ChatStatusEnum,
		default: ChatStatusEnum.ACTIVE,
	})
	@IsEnum(ChatStatusEnum)
	status: ChatStatusEnum

	@ManyToOne(() => User, (user) => user.chats)
	@JoinColumn()
	users: User[]

	@CreateDateColumn()
	created_at: Date

	@UpdateDateColumn()
	updated_at: Date

	@DeleteDateColumn()
	deleted_at: Date
}
