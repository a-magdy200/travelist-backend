import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'
import { Traveler } from './Traveler.entity'
import { FriendRequestStatusEnum } from '../helpers/enums/friendRequestStatus.enum'
import { IsEnum } from 'class-validator'
import { FriendRequestStatusType } from '../helpers/types/friendRequestStatus.type'

@Entity()
export class FriendRequest extends BaseEntity {
	@PrimaryGeneratedColumn()
	id?: number

	@Column({
		type: 'enum',
		enum: FriendRequestStatusEnum,
		default: FriendRequestStatusEnum.PENDING,
	})
	@IsEnum(FriendRequestStatusEnum)
	status: FriendRequestStatusType

	@ManyToOne(() => Traveler, (traveler) => traveler.sent_requests, {})
	sender: Traveler

	@ManyToOne(() => Traveler, (traveler) => traveler.received_requests, {})
	receiver: Traveler

	@CreateDateColumn()
	created_at: Date
	@UpdateDateColumn()
	updated_at: Date
}
