import {
	BaseEntity,
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'
import { Cycle } from './Cycle.entity'
import { Traveler } from './Traveler.entity'
import { Transaction } from './Transaction.entity'
import { IsBoolean } from 'class-validator'

@Entity('cycle_bookings')
export class CycleBooking extends BaseEntity {
	@PrimaryGeneratedColumn()
	id?: number

	@Column({
		type: 'boolean',
		default: false,
	})
	@IsBoolean()
	is_paid: boolean

	@ManyToOne(() => Cycle, (cycle) => cycle.bookings)
	@JoinColumn()
	cycle: Cycle[]

	@ManyToOne(() => Traveler, (traveler) => traveler.bookings)
	@JoinColumn()
	travelers: Traveler[]

	@OneToMany(() => Transaction, (transaction) => transaction.booking)
	transaction: Transaction

	@CreateDateColumn()
	created_at?: Date

	@UpdateDateColumn()
	updated_at?: Date

	@DeleteDateColumn()
	deleted_at?: Date
}
