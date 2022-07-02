
import { AppDataSource } from "../../config/database/data-source";
import { User } from "../../entities/User.entity";
import jwt from 'jsonwebtoken';

const login = async ( 
    req: {body: {name:string; password:string;};}, 
    res: {json: (arg0:{token:string;}) => void; sendStatus: (arg0:number) => void;}, 
    next: any) => {

        const user: any = await AppDataSource.manager.findOneBy(User, {
            name: req.body.name,
        });

        if (user!==null){

              // hashpassword

            if (req.body.name == user.name && req.body.password == user.password ){

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
}

export {
    login,
}