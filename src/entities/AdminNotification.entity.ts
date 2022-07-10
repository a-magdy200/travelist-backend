import {
	BaseEntity,
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'
import { NotificationStatusEnum } from '../helpers/enums/notificationStatus.enum'
import { IsEnum, IsInt, IsString, Length, Min } from 'class-validator'
import { NotificationEnum } from '../helpers/enums/notification.enum'
import { EntityNamesEnum } from '../helpers/enums/entityNames.enum'

@Entity('admin_notifications')
export class AdminNotification extends BaseEntity {
	@PrimaryGeneratedColumn()
	id?: number

	@Column({
		type: 'enum',
		enum: NotificationStatusEnum,
		default: NotificationStatusEnum.UNREAD,
	})
	@IsEnum(NotificationStatusEnum)
	status: NotificationStatusEnum

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
		type: 'enum',
		enum: EntityNamesEnum,
	})
	@IsEnum(EntityNamesEnum)
	entity_name: EntityNamesEnum

	@Column({
		type: 'int',
	})
	@IsInt()
	@Min(1)
	entity_id: number

	@CreateDateColumn()
	created_at?: Date

	@UpdateDateColumn()
	updated_at?: Date

	@DeleteDateColumn()
	deleted_at?: Date
}
