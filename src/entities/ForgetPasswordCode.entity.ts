import {
	BaseEntity,
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'
import { IsEmail, IsString, Length } from 'class-validator'

@Entity('forget_password_codes')
export class ForgetPasswordCode extends BaseEntity {
	@PrimaryGeneratedColumn()
	id?: number

	@Column()
	@IsEmail()
	email?: string

	@Column({ unique: true })
	@Length(3)
	@IsString()
	code?: string

	@CreateDateColumn()
	created_at?: Date

	@UpdateDateColumn()
	updated_at?: Date

	@DeleteDateColumn()
	deleted_at?: Date
}
