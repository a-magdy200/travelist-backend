
import {AppDataSource} from "../../config/database/data-source";
import {PasswordForget} from "../../entities/PasswordForget";
import {Request, Response} from "express";

const verifyCode = async (req: Request, res: Response, next: any)=> {
            if (req.body.email !== undefined && req.body.code !== undefined ) {

                const user_pass_forget = await AppDataSource.manager.findOneBy(PasswordForget, {
                    email: req.body.email,
                });

                if (user_pass_forget !== null) {

                    if (req.body.code == user_pass_forget.code) {
                        // token
                        res.json({
                             success: true,
                         });

                    } else {
                        res.json({
                             success: false,
                             error: "Incorrect code",
                         });
                    }
                }else{
                   res.json({
                         success: false,
                         error: "Invalid email, user not found",
                    });
                }
        }else{
           res.json({
             success: false,
             error: "Missing email or code",
           });
        }
}

export {
    verifyCode,
}