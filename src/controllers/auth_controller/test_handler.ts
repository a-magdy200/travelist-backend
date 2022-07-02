import { AppDataSource } from "../../config/database/data-source";
import { User } from "../../entities/User.entity";

const list = async ( 
    req: {headers: {[x:string]:any;}; token?:any }, 
    res: {json: (arg0:{user:any;}) => void;}, 
    next: any) => {

        const user: any = await AppDataSource.manager.find(User, {

        });

        res.json({
            user
        });
    }

export {
    list,
}