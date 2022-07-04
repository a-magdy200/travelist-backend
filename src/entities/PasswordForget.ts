import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'

@Entity()
export class PasswordForget extends BaseEntity {
	@PrimaryGeneratedColumn()
	id?: number
	@Column({ unique: true })
	email?: string
	@Column({ unique: true })
	code?: string
	@CreateDateColumn()
	created_at?: Date
	@UpdateDateColumn()
	updated_at?: Date
}
