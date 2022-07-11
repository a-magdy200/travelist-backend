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
import { IsString } from 'class-validator'
import { User } from './User.entity'
import { SupportTicket } from './SupportTicket.entity'

@Entity('support_ticket_responses')
export class SupportTicketResponse extends BaseEntity {
	@PrimaryGeneratedColumn()
	id?: number

	@Column({
		type: 'longtext',
	})
	@IsString()
	content: string

	@ManyToOne(() => SupportTicket, (supportTicket) => supportTicket.responses)
	@JoinColumn()
	ticket: SupportTicket

	@ManyToOne(() => User, (user) => user.supportTicketsResponses)
	@JoinColumn()
	user: User

	@CreateDateColumn()
	created_at: Date

	@UpdateDateColumn()
	updated_at: Date

	@DeleteDateColumn()
	deleted_at: Date
}
