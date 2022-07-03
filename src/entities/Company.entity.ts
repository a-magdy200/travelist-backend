import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm"

@Entity()
export class Company extends BaseEntity {
    @PrimaryGeneratedColumn()
    id?: number

    @Column()
    name: string

    @Column({ unique: true })
    email: string

    @Column({select: false})
    password: string

    @Column()
    rate: string
}