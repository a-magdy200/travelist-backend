import { AppDataSource } from "../../config/database/data-source";
import { User } from "../../entities/User.entity";
import { InsertResult } from "typeorm";

const register = async ( 
    req: {body: {name:string; email:string; password:string; type:any; address:string;};},
    res: {json: (arg0:{user:InsertResult;}) => void;}, 
    next: any) => {

        // hashpassword var bcrypt = require('bcrypt');
        const user = await AppDataSource.manager.insert<User>(User, {
            name: req.body.name ,
            email: req.body.email ,
            password: req.body.password,
            address: req.body.address,
            type: req.body.type
        });

        res.json({
            user
        });
    }

export {
    register,
}