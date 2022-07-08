import { Gender } from "../types/gender.type";
import { Type } from "../types/userType.type";

export interface IRegisterRequestBody {
    name: string;
    email: string;
    password: string;
    address: string;
    profile_picture: string;
    type: Type;
    national_id: string;
	gender: Gender;
	date_of_birth: Date;
	is_guide: boolean;
	// user: userId,
    // description: string,
}