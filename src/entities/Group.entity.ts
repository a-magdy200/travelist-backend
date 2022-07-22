import {
	BaseEntity,
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	JoinColumn,
	JoinTable,
	ManyToMany,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'
import { Country } from './Country.entity'
import { User } from './User.entity'
import { Post } from './Post.entity'
import { IsInt, IsPositive, IsString, Min } from "class-validator";

@Entity('groups')
export class Group extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ type: 'int', default: 0 })
	@IsInt()
	@Min(0)
	followers_count: number

	@Column({
		default: '',
	})
	@IsString()
	cover_picture: string

	@Column({
		type: "int"
	})
	@IsInt()
	@IsPositive()
	countryId: number;

	@OneToOne(() => Country, (country) => country.group, {cascade: true})
	@JoinColumn()
	country: Country;

	@OneToMany(() => Post, (post) => post.group)
	posts: Post[]
	
	@ManyToMany(() => User, (user) => user.groups)
	@JoinTable({
		name: 'group_follower',
	})
	followers: User[]

	@CreateDateColumn()
	created_at: Date

	@UpdateDateColumn()
	updated_at: Date

	@DeleteDateColumn()
	deleted_at: Date
}
