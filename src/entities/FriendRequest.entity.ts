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
import { Traveler } from './Traveler.entity'
import { FriendRequestStatusEnum } from '../helpers/enums/friendRequestStatus.enum'
import { IsEnum } from 'class-validator'
import { FriendRequestStatusType } from '../helpers/types/friendRequestStatus.type'

@Entity('friend_requests')
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

	@ManyToOne(() => Traveler, (traveler) => traveler.sent_requests)
	@JoinColumn()
	sender: Traveler

	@ManyToOne(() => Traveler, (traveler) => traveler.received_requests)
	@JoinColumn()
	receiver: Traveler

	@CreateDateColumn()
	created_at?: Date

	@UpdateDateColumn()
	updated_at?: Date

	@DeleteDateColumn()
	deleted_at?: Date
}
