import {
	BaseEntity,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'
import { ChatMessage } from './ChatMessage.entity'
import {ChatUser} from "./ChatUser.entity";

@Entity('chats')
export class Chat extends BaseEntity {
	@PrimaryGeneratedColumn()
	id?: number

	@OneToMany(() => ChatUser, (chatUser) => chatUser.chat)
	chatUsers: ChatUser[]


	@OneToMany(() => ChatMessage, (message) => message.chat)
	messages: ChatMessage[]

	@CreateDateColumn()
	created_at: Date

	@UpdateDateColumn()
	updated_at: Date

	@DeleteDateColumn()
	deleted_at: Date
}
