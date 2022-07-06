import { AppDataSource } from "../../config/database/data-source";
import { User } from "../../entities/User.entity";
import { PasswordForget } from "../../entities/PasswordForget";
import nodemailer from "nodemailer";
import { Request, Response } from "express";

const forgetPassword = async (req: Request, res: Response, next: any) => {
  if (req.body.email !== undefined) {
    const user = await AppDataSource.manager.findOneBy(User, {
      email: req.body.email,
    });

    if (user !== null) {
      const email = user.email;
      const code = Math.random().toString(20).substring(2, 12);

      const user_pass_forget = await AppDataSource.manager.findOneBy(
        PasswordForget,
        {
          email: email,
        }
      );

      if (user_pass_forget !== null) {
        user_pass_forget.code = code;
        await AppDataSource.manager.save(user_pass_forget);
      } else {
        const user_pass_forget =
          await AppDataSource.manager.insert<PasswordForget>(PasswordForget, {
            email: email,
            code: code,
          });
      }

      const transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 465,
        secure: false,
        requireTLS: true,
        auth: {
          user: "5c79325f103ce5",
          pass: "7eaac2bbfd789d",
        },
        logger: true,
      });

      const info = await transporter.sendMail({
        from: "djangonotifysys@gmail.com",
        to: "ramez.youssef.fahmy@gmail.com",
        subject: "verify code to reset password",
        text:
          "please, copy the attached code to verify your account and reset a new password, the code: " +
          code,
        headers: { "x-myheader": "test header" },
      });

      return res.status(200).json({
        success: true,
        info,
      });
    } else {
      return res.status(404).json({
        success: false,
        error: "Invalid email, user not exist",
      });
    }
  } else {
    return res.status(404).json({
      success: false,
      error: "Missing email",
    });
  }
  // logger.log("error from forget_password_func"+json.stringify(req)+json.stringify(e));
};

export { forgetPassword };
