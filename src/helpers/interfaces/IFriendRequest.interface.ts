import { FriendRequestStatusType } from '../helpers/types/friendRequestStatus.type'
export interface IFriendRequestInterface {
    id?:number
	senderId?: number
	recieverId?: number
	status?:FriendRequestStatusType
}
