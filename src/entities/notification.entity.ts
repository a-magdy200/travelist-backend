import {
  BaseEntity, Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity, JoinColumn, ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { User } from "./User.entity";
import { NotificationEnum } from "../helpers/enums/notification.enum";
import { IsEnum, Length } from "class-validator";
import { NotificationStatusEnum } from "../helpers/enums/notificationStatus.enum";

@Entity()
export class Notification extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number

  @Column({
    type: "enum",
    enum: NotificationStatusEnum,
    default: NotificationStatusEnum.UNREAD
  })
  @IsEnum(NotificationStatusEnum)
  status: NotificationStatusEnum;

  @Column()
  @Length(3)
  title: string;

  @Column()
  @Length(3)
  content: string;

  @Column({
    type: "enum",
    enum: NotificationEnum
  })
  @IsEnum(NotificationEnum)
  type: NotificationEnum;

  @ManyToOne(() => User, user => user.notifications)
  @JoinColumn()
  user: User

  @CreateDateColumn()
  created_at?: Date

  @UpdateDateColumn()
  updated_at?: Date

  @DeleteDateColumn()
  deleted_at?: Date
}
