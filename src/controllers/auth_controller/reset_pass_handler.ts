
import { AppDataSource } from "../../config/database/data-source";
import { User } from "../../entities/User.entity";
const bcrypt = require('bcrypt');

const resetPassword = async (
    req: {body: {email:string; password:string};},
    res: {sendStatus: (arg0:number) => void;},
    next: any) => {
        try{
            if (req.body.email !== undefined){
                const user= await AppDataSource.manager.findOneBy(User, {
                    email: req.body.email,
                });

                if (user !== null && req.body.password !== undefined) {
                    // validate
                    const salt = await bcrypt.genSalt(10);
                    const pass = await bcrypt.hash(req.body.password, salt);
                    user.password = pass;
                    await AppDataSource.manager.save(user);
                    res.sendStatus(200);
                }else{
                   res.sendStatus(403);
                }
            }
        }catch{
            res.sendStatus(403);
        }
}

export {
    resetPassword,
}