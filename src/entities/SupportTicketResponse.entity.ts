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
import { IsEnum, IsString } from "class-validator";
import { User } from "./User.entity";
import { SupportTicket } from "./SupportTicket.entity";

@Entity()
export class SupportTicketResponse extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number

  @Column({
    type: "longtext"
  })
  @IsString()
  content: string;

  @ManyToOne(() => SupportTicket, supportTicket => supportTicket.responses)
  @JoinColumn()
  ticket: SupportTicket;

  @ManyToOne(() => User, user => user.supportTicketsResponses)
  @JoinColumn()
  user: User;

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @DeleteDateColumn()
  deleted_at: Date
}
