import {
  BaseEntity, Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity, JoinColumn, ManyToOne, OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Chat } from "./Chat.entity";
import { MessageStatusEnum } from "../helpers/enums/messageStatus.enum";
import { IsEmail, IsEnum, Length } from "class-validator";
import { User } from "./User.entity";
import { SupportTicketStatusEnum } from "../helpers/enums/supportTicketStatus.enum";
import { SupportTicketResponse } from "./SupportTicketResponse.entity";

@Entity()
export class SupportTicket extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number

  @Column()
  @Length(3)
  subject: string;

  @Column()
  @IsEmail()
  email: string;

  @Column({
    type: "enum",
    enum: SupportTicketStatusEnum,
    default: SupportTicketStatusEnum.PENDING
  })
  @IsEnum(SupportTicketStatusEnum)
  status: SupportTicketStatusEnum;

  @Column({
    type: "longtext"
  })
  content: string;

  @ManyToOne(() => User, user => user.tickets, {nullable: true})
  @JoinColumn()
  user: User;

  @OneToMany(() => SupportTicketResponse, response => response.ticket)
  responses: SupportTicketResponse[];

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @DeleteDateColumn()
  deleted_at: Date
}
