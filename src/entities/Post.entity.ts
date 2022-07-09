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
import { IsDate, IsEnum, Length } from 'class-validator'
import { Group } from './Group.entity'
import { Traveler } from './Traveler.entity'
import { PostStatus } from '../helpers/types/postStatus.type'
import { PostStatusEnum } from '../helpers/enums/postStatus.enum'

@Entity()
export class Post extends BaseEntity {
	@PrimaryGeneratedColumn()
	id?: number

	@Column({ type: 'longtext' })
	@Length(10)
	content: string

	@Column({ type: 'enum', enum: PostStatusEnum })
	@IsEnum(PostStatusEnum)
	status: PostStatus

	@CreateDateColumn()
	created_at: Date

	@UpdateDateColumn()
	updated_at: Date

	@DeleteDateColumn()
	deleted_at: Date

	@ManyToOne(() => Traveler, (traveler) => traveler.posts, {})
	@JoinColumn()
	traveler: Traveler

	@ManyToOne(() => Group, (group) => group.posts, {})
	@JoinColumn()
	group: Group
}
