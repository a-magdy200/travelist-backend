
import { AppDataSource } from "../../config/database/data-source";
import { User } from "../../entities/User.entity";
import { InsertResult } from "typeorm";
const bcrypt = require('bcrypt');

const register = async ( 
    req: {body: {name:string; email:string; password:string; type:any; address:string;};},
    res: {json: (arg0:{user:InsertResult;}) => void;}, 
    next: any) => {

    if (req.body.name !== undefined && req.body.email !== undefined && req.body.password !== undefined && req.body.address !== undefined){

        const salt = await bcrypt.genSalt(10);
        const pass = await bcrypt.hash(req.body.password, salt);

        const user = await AppDataSource.manager.insert<User>(User, {
            name: req.body.name ,
            email: req.body.email ,
            password: pass,
            address: req.body.address,
            type: req.body.type
        });

        res.json({
            user
        });
    }else{
        console.log("missing elements");
    }

}

export {
    register,
}