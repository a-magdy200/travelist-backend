import {BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import { Cycle } from "./Cycle.entity";

@Entity()
export class Country extends BaseEntity {
	@PrimaryGeneratedColumn()
	id?: number

	@Column()
	name?: string

  @OneToMany(() => Cycle, (cycle) => cycle.departure_location,)
  @OneToMany(() => Cycle, (cycle) => cycle.return_location)
  @OneToMany(() => Cycle, (cycle) => cycle.return_arrival_location)
  @OneToMany(() => Cycle, (cycle) => cycle.arrival_location)
  cycles?: Cycle[]

 // @OneToMany(() => Cycle, (cycle) => cycle.return_location)
 // @JoinColumn({ name: "return_location" })
  //cycles2?: Cycle[]
  
  @CreateDateColumn({ name: 'created_at' })
  createdAt?: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt?: Date
}
