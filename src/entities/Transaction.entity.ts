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
import { IsNumber, Min } from 'class-validator'
import { User } from './User.entity'
import { CycleBooking } from './CycleBooking'

@Entity('transactions')
export class Transaction extends BaseEntity {
	@PrimaryGeneratedColumn()
	id?: number

	@Column({
		nullable: true,
	})
	payment_id: string

	@Column({
		type: 'float',
		default: 1,
	})
	@Min(1)
	@IsNumber()
	amount: number

	@ManyToOne(() => User, (user) => user.transactions)
	@JoinColumn()
	user: User

	@ManyToOne(() => CycleBooking, (cycleBooking) => cycleBooking.transaction,{
		onDelete:"CASCADE"
	})
	@JoinColumn()
	booking: CycleBooking

	@CreateDateColumn()
	created_at?: Date

	@UpdateDateColumn()
	updated_at?: Date

	@DeleteDateColumn()
	deleted_at?: Date
}
