import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class PasswordForget extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;
  @Column({ unique: true })
  email?: string;
  @Column({ unique: true })
  code?: string;
}