import {
	BaseEntity,
	Entity,
	Column,
	PrimaryGeneratedColumn,
	OneToMany,
	CreateDateColumn,
	UpdateDateColumn,
	OneToOne,
	JoinColumn,
} from 'typeorm'
import { Program } from './Program.entity'
import { User } from './User.entity'

@Entity()
export class Company extends BaseEntity {
	@PrimaryGeneratedColumn()
	id?: number

	@CreateDateColumn({ name: 'created_at' })
	createdAt?: Date

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt?: Date

	@Column({ default: '' })
	description?: string

	@Column()
	rate: string

	@Column({ default: '' })
	cover_picture?: string

	@OneToOne(() => User)
	@JoinColumn()
	user: User

	@OneToMany(() => Program, (program) => program.company)
	programs?: Program[]
}
