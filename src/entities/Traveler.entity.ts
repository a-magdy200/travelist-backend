import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BaseEntity,
	OneToOne,
	JoinColumn,
} from 'typeorm'
import { User } from './User.entity'
export type GenderType = 'female' | 'male'
@Entity()
export class Traveler extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;
  @Column({ unique: true ,type: 'bigint'})
  national_id:string
  @Column({
    type: "enum",
    enum: ["female", "male"],
    default: "female",
  })
  gender!: GenderType;
  @Column()
  date_of_birth?: Date;
  @Column()
  is_guide?: boolean;

	@OneToOne(() => User)
	@JoinColumn()
	user: User
}
