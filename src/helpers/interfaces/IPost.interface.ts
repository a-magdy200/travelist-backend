import { PostStatusType } from '../types/postStatus.type'

export interface IPostInterface {
	id?: number
	content?: string
	status:PostStatusType
	travelerId:number
	groupId:number
}
