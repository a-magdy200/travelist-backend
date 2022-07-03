
import {AppDataSource} from "../../config/database/data-source";
import {PasswordForget} from "../../entities/PasswordForget";

const verifyCode = async (
    req: {body: {email:string; code:string;};},
    res: {sendStatus: (arg0:number) => void;},
    next: any) => {

        try{
            if (req.body.email !== undefined && req.body.code !== undefined ) {

                const user_pass_forget = await AppDataSource.manager.findOneBy(PasswordForget, {
                    email: req.body.email,
                });

                if (user_pass_forget !== null) {

                    if (req.body.code == user_pass_forget.code) {
                        console.log('matched');
                        res.sendStatus(200);
                    } else {
                        console.log('not matched');
                        res.sendStatus(404);
                    }
                }
            }
        }catch{
            res.sendStatus(404);
        }
}

export {
    verifyCode,
}