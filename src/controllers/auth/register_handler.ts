
import { AppDataSource } from "../../config/database/data-source";
import { User } from "../../entities/User.entity";
import { InsertResult } from "typeorm";
const bcrypt = require('bcrypt');
import {Request, Response} from "express";

const register = async (req: Request, res: Response, next: any) => {

    if (req.body.name !== undefined && req.body.email !== undefined && req.body.password !== undefined && req.body.address !== undefined){

        const salt = await bcrypt.genSalt(10);
        const pass = await bcrypt.hash(req.body.password, salt);
        // validate check mail not exist
        const user = await AppDataSource.manager.insert<User>(User, {
            name: req.body.name ,
            email: req.body.email ,
            password: pass,
            address: req.body.address,
            type: req.body.type
        });

        res.json({
            success: true,
            user
        });
    }else{
         res.json({
             success: false,
             error: "Missing name | email | password | address",
         });
    }
}

export {
    register,
}