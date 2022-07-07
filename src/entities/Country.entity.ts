import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn, JoinTable, ManyToMany,
	OneToMany, OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from "typeorm";
import { Cycle } from './Cycle.entity'
import { Group } from "./Group.entity";
import { IsInt } from "class-validator";
import { User } from "./User.entity";

@Entity()
export class Country extends BaseEntity {
	@PrimaryGeneratedColumn()
	id?: number

	@Column()
	name?: string

	@OneToMany(() => Cycle, (cycle) => cycle.departure_location)
	@OneToMany(() => Cycle, (cycle) => cycle.return_location)
	@OneToMany(() => Cycle, (cycle) => cycle.return_arrival_location)
	@OneToMany(() => Cycle, (cycle) => cycle.arrival_location)
	cycles?: Cycle[]


	@OneToOne(() => Group, group => group.country)
	@JoinColumn()
	group: Group;

	@Column({type: "int", default: 0})
	@IsInt()
	total_rate: number;
	@Column({type: "float", default: 0})
	@IsInt()
	average_rate: number;
	@Column({type: "int", default: 0})
	@IsInt()
	ratings_count: number;
	// @OneToMany(() => Cycle, (cycle) => cycle.return_location)
	// @JoinColumn({ name: "return_location" })
	//cycles2?: Cycle[]

	@CreateDateColumn({ name: 'created_at' })
	createdAt?: Date

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt?: Date
}
