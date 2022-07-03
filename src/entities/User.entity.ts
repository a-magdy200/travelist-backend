import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";

export type UserType = "traveler" | "company";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;
  @Column({ unique: true })
  name?: string;
  @Column({ unique: true })
  email?: string;
  @Column()
  password?: string;
  @Column()
  address?: string;
  @Column({
    type: "enum",
    enum: ["traveler", "company"],
    default: "traveler"
  })
  type!: UserType;
}
