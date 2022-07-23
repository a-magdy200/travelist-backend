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
import { Chat } from './Chat.entity'
import { MessageStatusEnum } from '../helpers/enums/messageStatus.enum'
import {IsEnum, IsInt, IsPositive, IsString, Length} from 'class-validator'
import { User } from './User.entity'
import {ChatUser} from "./ChatUser.entity";

@Entity('chat_messages')
export class ChatMessage extends BaseEntity {
	@PrimaryGeneratedColumn()
	id?: number

	@Column({
		type: 'enum',
		enum: MessageStatusEnum,
		default: MessageStatusEnum.UNREAD,
	})
	@IsEnum(MessageStatusEnum)
	status: MessageStatusEnum

	@Column({
		type: 'longtext',
	})
	@Length(1)
	@IsString()
	content: string

	@Column({
		type: 'int'
	})
	@IsInt()
	@IsPositive()
	userId: number;

	@Column({
		type: 'int'
	})
	@IsInt()
	@IsPositive()
	chatId: number;

	@ManyToOne(() => User, (user) => user.messages)
	@JoinColumn()
	user: User

	@ManyToOne(() => Chat, (chat) => chat.messages)
	@JoinColumn()
	chat: Chat

	@CreateDateColumn()
	created_at: Date

	@UpdateDateColumn()
	updated_at: Date

	@DeleteDateColumn()
	deleted_at: Date
}
