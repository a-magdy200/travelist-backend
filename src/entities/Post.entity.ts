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
import { IsEnum, IsString, Length } from 'class-validator'
import { Group } from './Group.entity'
import { Traveler } from './Traveler.entity'
import { PostStatusType } from '../helpers/types/postStatus.type'
import { PostStatusEnum } from '../helpers/enums/postStatus.enum'
import { PostReport } from './PostReport.entity'

@Entity('posts')
export class Post extends BaseEntity {
	@PrimaryGeneratedColumn()
	id?: number

	@Column({ type: 'longtext' })
	@Length(10)
	@IsString()
	content: string

	@Column({ type: 'enum', enum: PostStatusEnum })
	@IsEnum(PostStatusEnum)
	status: PostStatusType

	@OneToMany(() => PostReport, (postReport) => postReport.post)
	reports: PostReport[]

	@ManyToOne(() => Traveler, (traveler) => traveler.posts)
	@JoinColumn()
	traveler: Traveler

	@ManyToOne(() => Group, (group) => group.posts)
	@JoinColumn()
	group: Group

	@CreateDateColumn()
	created_at: Date

	@UpdateDateColumn()
	updated_at: Date

	@DeleteDateColumn()
	deleted_at: Date
}
