
import {AppDataSource} from "../../config/database/data-source";
import {User} from "../../entities/User.entity";
import {PasswordForget} from "../../entities/PasswordForget";
import nodemailer from "nodemailer";

const forgetPassword = async (
    req: {body: {name:string;};},
    res: {sendStatus: (arg0:number) => void;},
    next: any) => {

        try{
            if (req.body.name !== undefined) {

                const user = await AppDataSource.manager.findOneBy(User, {
                    name: req.body.name,
                });

                if(user !== null) {
                    const email = user.email;
                    const code = Math.random().toString(20).substring(2, 12);

                    const user_pass_forget = await AppDataSource.manager.findOneBy(PasswordForget, {
                        email: email,
                     });

                    if (user_pass_forget !== null){
                        user_pass_forget.code = code;
                        await AppDataSource.manager.save(user_pass_forget);
                        console.log(user_pass_forget);
                    }else{
                        const user_pass_forget = await AppDataSource.manager.insert<PasswordForget>(PasswordForget, {
                            email: email,
                            code: code
                        });
                    }

                    const transporter = nodemailer.createTransport({
                        host: 'smtp.mailtrap.io',
                        port: 465,
                        secure: false,
                        requireTLS: true,
                        auth: {
                            user: '5c79325f103ce5',
                            pass: '7eaac2bbfd789d'
                        },
                        logger: true
                    });

                    const info = await transporter.sendMail({
                        from: 'djangonotifysys@gmail.com',
                        to: email,
                        subject: "verify code to reset password",
                        text: "please, copy the attached code to verify your account and reset a new password, the code: " + code,
                        headers: {'x-myheader': 'test header'}
                    });

                    // console.log("Message sent: %s", info.response);
                    res.sendStatus(200);
                }else{
                    res.sendStatus(403);
                }
            }
        }catch{
            res.sendStatus(404);
        }
}

export {
    forgetPassword,
}