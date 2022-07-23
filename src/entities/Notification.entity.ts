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
import { NotificationEnum } from '../helpers/enums/notification.enum'
import {IsEnum, IsInt, IsPositive, IsString, Length} from 'class-validator'
import { NotificationStatusEnum } from '../helpers/enums/notificationStatus.enum'

@Entity('notifications')
export class Notification extends BaseEntity {
	@PrimaryGeneratedColumn()
	id?: number

	@Column({
		type: 'enum',
		enum: NotificationStatusEnum,
		default: NotificationStatusEnum.UNREAD,
	})
	@IsEnum(NotificationStatusEnum)
	status?: NotificationStatusEnum

	@Column()
	@Length(3)
	@IsString()
	title: string

	@Column()
	@Length(3)
	@IsString()
	content: string

	@Column({
		type: 'enum',
		enum: NotificationEnum,
	})
	@IsEnum(NotificationEnum)
	type: NotificationEnum

	@Column({
		type: 'int'
	})
	@IsInt()
	@IsPositive()
	userId: number;

	@ManyToOne(() => User, (user) => user.notifications)
	@JoinColumn()
	user?: User

	@CreateDateColumn()
	created_at?: Date

	@UpdateDateColumn()
	updated_at?: Date

	@DeleteDateColumn()
	deleted_at?: Date
}
