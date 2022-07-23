import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import {Traveler} from './Traveler.entity'

@Entity('traveler_friends')
export class TravelerFriends extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number

  @ManyToOne(() => Traveler, (traveler) => traveler.traveler1_friends, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  })
  @JoinColumn(
    {name: "sender_id"})
  traveler_sender: Traveler

  @ManyToOne(() => Traveler, (traveler) => traveler.traveler2_friends, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  })
  @JoinColumn(
    {name: "receiver_id"}
  )
  traveler_receiver: Traveler

  @Column({
    type: "int",
    nullable: true,
  })
  sender_id: number

  @Column({
    type: "int",
    nullable: true,
  })
  receiver_id: number


  @CreateDateColumn()
  created_at?: Date

  @UpdateDateColumn()
  updated_at?: Date

  @DeleteDateColumn()
  deleted_at?: Date
}
