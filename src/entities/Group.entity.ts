import {
  BaseEntity,
  Column,
  CreateDateColumn, DeleteDateColumn,
  Entity,
  JoinColumn, JoinTable, ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Country } from "./Country.entity";
import { User } from "./User.entity";

@Entity()
export class Group extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: "int", default: 0})
  members_count: number;

  @Column()
  cover_picture: string;

  @OneToOne(() => Country, country => country.group)
  @JoinColumn()
  country: Country;

  @ManyToMany(() => User, user => user.groups)
  @JoinTable()
  followers: User[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

}
