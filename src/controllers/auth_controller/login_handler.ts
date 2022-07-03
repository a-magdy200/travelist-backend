
import { AppDataSource } from "../../config/database/data-source";
import { User } from "../../entities/User.entity";
import jwt from 'jsonwebtoken';
const bcrypt = require('bcrypt');

const login = async ( 
    req: {body: {name:string; password:string;};}, 
    res: {json: (arg0:{token:string;}) => void; sendStatus: (arg0:number) => void;}, 
    next: any) => {

        if (req.body.name !== undefined && req.body.password !== undefined){

            const user: any = await AppDataSource.manager.findOneBy(User, {
                name: req.body.name,
            });

            if (user!==null){

                const validPassword = await bcrypt.compare(req.body.password, user.password);

                if (validPassword){
                    jwt.sign( {user},'secretkey', (err:any ,token:any) => {
                        res.json({
                            token
                        });
                    });
                }else{
                  res.sendStatus(403);
                }
            }else{
                  res.sendStatus(404);
            }
        }else{
             res.sendStatus(404);
        }
}

export {
    login,
}