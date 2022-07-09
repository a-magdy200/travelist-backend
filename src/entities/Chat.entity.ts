import {
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  Entity, ManyToMany, ManyToOne, OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { ChatMessage } from "./ChatMessage.entity";

@Entity()
export class Chat extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number

  @OneToMany(() => ChatMessage, message => message.chat)
  messages: ChatMessage[];

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @DeleteDateColumn()
  deleted_at: Date
}
