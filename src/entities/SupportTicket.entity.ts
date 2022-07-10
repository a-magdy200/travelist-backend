import {
	BaseEntity,
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'
import { IsEmail, IsEnum, IsString, Length } from 'class-validator'
import { User } from './User.entity'
import { SupportTicketStatusEnum } from '../helpers/enums/supportTicketStatus.enum'
import { SupportTicketResponse } from './SupportTicketResponse.entity'

@Entity('support_tickets')
export class SupportTicket extends BaseEntity {
	@PrimaryGeneratedColumn()
	id?: number

	@Column()
	@Length(3)
	@IsString()
	subject: string

	@Column()
	@IsEmail()
	email: string

	@Column({
		type: 'enum',
		enum: SupportTicketStatusEnum,
		default: SupportTicketStatusEnum.PENDING,
	})
	@IsEnum(SupportTicketStatusEnum)
	status: SupportTicketStatusEnum

	@Column({
		type: 'longtext',
	})
	@IsString()
	content: string

	@ManyToOne(() => User, (user) => user.tickets, { nullable: true })
	@JoinColumn()
	user: User

	@OneToMany(() => SupportTicketResponse, (response) => response.ticket)
	responses: SupportTicketResponse[]

	@CreateDateColumn()
	created_at: Date

	@UpdateDateColumn()
	updated_at: Date

	@DeleteDateColumn()
	deleted_at: Date
}
