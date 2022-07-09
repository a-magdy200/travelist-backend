import {
  BaseEntity, Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity, ManyToMany, ManyToOne, OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { ChatMessage } from "./ChatMessage.entity";
import { User } from "./User.entity";
import { MessageStatusEnum } from "../helpers/enums/messageStatus.enum";
import { IsEnum } from "class-validator";
import { ChatStatusEnum } from "../helpers/enums/chatStatus.enum";

@Entity()
export class ChatUser extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number
  @Column({
    type: "enum",
    enum: ChatStatusEnum,
    default: ChatStatusEnum.ACTIVE
  })
  @IsEnum(ChatStatusEnum)
  status: ChatStatusEnum;

  @ManyToMany(() => User, user => user.chats)
  users: User[];

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @DeleteDateColumn()
  deleted_at: Date
}
