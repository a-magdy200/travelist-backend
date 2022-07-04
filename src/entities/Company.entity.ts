import {BaseEntity, Entity,Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Program } from "./Program.entity"

@Entity()
export class Company extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name?:string

  @CreateDateColumn({ name: 'created_at' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt?: Date;

 
  @OneToMany(() => Program, (program) => program.company)
  programs?: Program[]
}
