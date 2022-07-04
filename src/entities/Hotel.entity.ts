import {BaseEntity, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import { Program } from "./Program.entity";

@Entity()
export class Hotel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name?:string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt?: Date;

 // @ManyToMany((program) => Program, (program) => program.hotels)
 // program?: Program[];
 
// @ManyToMany(() => Program,program=>program.hotels,{
 // cascade:true
 //})
 //program?:Program
 
}
