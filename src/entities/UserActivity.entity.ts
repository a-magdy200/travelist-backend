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

@Entity('user_activities')
export class UserActivity extends BaseEntity {
	@PrimaryGeneratedColumn()
	id?: number

	@Column()
	@Length(3)
	@IsString()
	activity: string

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
