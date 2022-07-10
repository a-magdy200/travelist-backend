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
import { Post } from './Post.entity'
import { IsString, Length } from 'class-validator'

@Entity('post_reports')
export class PostReport extends BaseEntity {
	@PrimaryGeneratedColumn()
	id?: number

	@Column({
		type: 'longtext',
	})
	@IsString()
	@Length(10)
	reason: string

	@ManyToOne(() => User, (user) => user.post_reports)
	@JoinColumn()
	user: User

	@ManyToOne(() => Post, (post) => post.reports)
	@JoinColumn()
	post: Post

	@CreateDateColumn()
	created_at: Date

	@UpdateDateColumn()
	updated_at: Date

	@DeleteDateColumn()
	deleted_at: Date
}
