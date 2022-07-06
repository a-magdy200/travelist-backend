import {BaseEntity, Column, Entity, ManyToOne,PrimaryGeneratedColumn,ManyToMany,JoinTable, CreateDateColumn, UpdateDateColumn} from "typeorm";
import {IsDate} from "class-validator"
import { Program } from "./Program.entity"
import { User } from "./User.entity"
import { Country } from "./Country.entity";


@Entity()
export class Cycle extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name?:string;

  @Column()
  max_seats?:number;

  @Column({ type: 'int', default: 0, })
  current_seats?:number;

  @Column()
  @IsDate()
  departure_date?:Date;

  @Column()
  @IsDate()
  arrival_date?:Date;

  @Column()
  @IsDate()
  return_date?:Date;

  @Column()
  @IsDate()
  return_arrival_date?:Date;

 // @Column()
 //departure_location?:number;

//  @Column()
 // arrival_location?:number;

  //@Column()
  //return_location?:number;

  //@Column()
  //return_arrival_location?:number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt?: Date;
  
  @ManyToOne(() => Program, (program) => program.cycles,{onUpdate: 'CASCADE'})
  program?: Program

  @ManyToOne(() => Country, (country) => country.cycles,{onUpdate: 'CASCADE'})
  departure_location?: Country

  @ManyToOne(() => Country, (country) => country.cycles,{onUpdate: 'CASCADE'})
  return_location?: Country

  @ManyToOne(() => Country, (country) => country.cycles,{onUpdate: 'CASCADE'})
  arrival_location?: Country

  @ManyToOne(() => Country, (country) => country.cycles,{onUpdate: 'CASCADE'})
  return_arrival_location?: Country

  @ManyToMany(() => User)
  @JoinTable()
  users?: User[]
}
