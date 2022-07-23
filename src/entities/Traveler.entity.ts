import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BaseEntity,
	OneToOne,
	JoinColumn,
	ManyToMany,
	JoinTable,
	OneToMany,
	CreateDateColumn,
	UpdateDateColumn,
	DeleteDateColumn,
} from 'typeorm'
import { User } from './User.entity'
import {
	IsBoolean,
	IsDate,
	IsEnum, IsIn,
	IsInt,
	IsNumber,
	IsString,
	Length,
	Max,
	Min
} from "class-validator";
import { Post } from './Post.entity'
import { GenderEnum } from '../helpers/enums/gender.enum'
import { GenderType } from '../helpers/types/gender.type'
import { Cycle } from './Cycle.entity'
import { FriendRequest } from './FriendRequest.entity'
import { HotelReview } from './HotelReview.entity'
import { GuideReview } from './GuideReview.entity'
import { CountryReview } from './CountryReview.entity'
import { CompanyReview } from './CompanyReview.entity'
import { CycleReview } from './CycleReview.entity'
import { CycleBooking } from './CycleBooking'
import { TravelerFriends } from './TravelerFriend.entity';

@Entity('travelers')
export class Traveler extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ unique: true, nullable: true })
	@Length(14, 14)
	@IsString()
	national_id?: string

	@Column({
		type: 'enum',
		enum: GenderEnum,
		default: GenderEnum.MALE,
	})
	@IsEnum(GenderEnum)
	gender: GenderType

	@Column({ type: 'date' })
	@IsDate()
	date_of_birth?: Date

	@Column({ default: false, type: 'boolean' })
	@IsBoolean()
	is_guide?: boolean

	@Column({ default: 0, type: 'int' })
	@IsInt()
	@Min(0)
	total_rate?: number

	@Column({ default: 0, type: 'int' })
	@IsInt()
	@Min(0)
	ratings_count?: number

	@Column({ default: 0, type: 'float' })
	@IsNumber()
	@Min(0)
	@Max(5)
	average_rate?: number

	@Column({
		type: "int"
	})
	@IsInt()
	userId: number;

	@OneToMany(() => FriendRequest, (friend_request) => friend_request.sender)
	sent_requests: FriendRequest[]

	@OneToMany(() => HotelReview, (hotelReview) => hotelReview.traveler)
	hotels_reviews: HotelReview[]

	@OneToMany(() => CycleReview, (cycleReview) => cycleReview.traveler)
	cycles_reviews: CycleReview[]

	@OneToMany(() => CompanyReview, (companyReview) => companyReview.traveler)
	companies_reviews: CompanyReview[]

	@OneToMany(() => GuideReview, (guideReview) => guideReview.traveler)
	reviews: GuideReview[]

	@OneToMany(() => GuideReview, (guideReview) => guideReview.traveler)
	guide_reviews: GuideReview[]

	@OneToMany(() => CountryReview, (countryReview) => countryReview.traveler)
	country_reviews: CountryReview[]

	@OneToMany(() => FriendRequest, (friend_request) => friend_request.receiver)
	received_requests: FriendRequest[]

	@OneToMany(() => Post, (post) => post.traveler)
	posts: Post[]

	@OneToMany(() => TravelerFriends, (friend) => friend.traveler_sender,{onUpdate: 'CASCADE',
	onDelete: 'CASCADE' })
	traveler1_friends: Traveler[]

	@OneToMany(() => TravelerFriends, (friend) => friend.traveler_receiver,{onUpdate: 'CASCADE',
	onDelete: 'CASCADE' })
	traveler2_friends: Traveler[]

	@OneToOne(() => User, (user) => user.traveler)
	@JoinColumn()
	user: User

	@OneToMany(() => CycleBooking, (booking) => booking.travelers)
	bookings: CycleBooking[]

	@CreateDateColumn()
	created_at?: Date

	@UpdateDateColumn()
	updated_at?: Date

	@DeleteDateColumn()
	deleted_at?: Date
}

