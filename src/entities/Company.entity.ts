import { Entity, PrimaryGeneratedColumn, Column, BaseEntity ,OneToOne,JoinColumn } from "typeorm"
import { User } from "./User.entity"
@Entity()
export class Company extends BaseEntity {
    @PrimaryGeneratedColumn()
    id?: number

    @Column({select: false})
    identification: string

    @Column({default: ''})
    description?: string;

    @Column()
    rate: string
    @Column({ default: "" })
    cover_picture?: string;

    @OneToOne(() => User)
    @JoinColumn()
    user: User



   
}
