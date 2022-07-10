import {
	BaseEntity,
	Column,
	Entity,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	DeleteDateColumn,
	ManyToOne,
	JoinColumn,
} from 'typeorm'
import { IsString, Length } from 'class-validator'
import { User } from './User.entity'

@Entity('user_reports')
export class UserReport extends BaseEntity {
	@PrimaryGeneratedColumn()
	id?: number

	@Column({
		type: 'longtext',
	})
	@IsString()
	@Length(10)
	reason: string

	@ManyToOne(() => User, (user) => user.reports)
	@JoinColumn()
	reported_user: User

	@ManyToOne(() => User, (user) => user.reported_users)
	@JoinColumn()
	reporter_user: User

	@CreateDateColumn()
	created_at?: Date

	@UpdateDateColumn()
	updated_at?: Date

	@DeleteDateColumn()
	deleted_at?: Date
}
