import {
  BaseEntity, Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity, JoinColumn, ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Chat } from "./Chat.entity";
import { MessageStatusEnum } from "../helpers/enums/messageStatus.enum";
import { IsEnum, IsString, Length } from "class-validator";
import { User } from "./User.entity";

@Entity()
export class ChatMessage extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number

  @ManyToOne(() => Chat, chat => chat.messages)
  @JoinColumn()
  chat: Chat[];

  @Column({
    type: "enum",
    enum: MessageStatusEnum,
    default: MessageStatusEnum.UNREAD
  })
  @IsEnum(MessageStatusEnum)
  status: MessageStatusEnum;

  @Column({
    type: "longtext"
  })
  @Length(1)
  @IsString()
  content: string;

  @ManyToOne(() => User, user => user.messages)
  @JoinColumn()
  user: User;

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @DeleteDateColumn()
  deleted_at: Date
}
