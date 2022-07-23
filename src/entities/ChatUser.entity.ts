import {
	BaseEntity,
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	JoinColumn,
	ManyToOne, OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'
import { User } from './User.entity'
import {IsEnum, IsInt, IsPositive} from 'class-validator'
import { ChatStatusEnum } from '../helpers/enums/chatStatus.enum'
import {Chat} from "./Chat.entity";
import {ChatMessage} from "./ChatMessage.entity";

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

	@Column({
		type: 'int'
	})
	@IsInt()
	@IsPositive()
	chatId: number;

	@Column({
		type: 'int'
	})
	@IsInt()
	@IsPositive()
	userId: number;

	@ManyToOne(() => User, (user) => user.chats)
	@JoinColumn()
	user: User

	@ManyToOne(() => Chat, (chat) => chat.chatUsers)
	@JoinColumn()
	chat: Chat

	@CreateDateColumn()
	created_at: Date

	@UpdateDateColumn()
	updated_at: Date

	@DeleteDateColumn()
	deleted_at: Date
}
