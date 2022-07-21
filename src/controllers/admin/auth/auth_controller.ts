import { Request, Response } from "express";
import { AppDataSource } from "../../../config/database/data-source";
import { User } from "../../../entities/User.entity";
import { loginValidation } from "../../../helpers/validations/login.validation";
import { sendErrorResponse } from "../../../helpers/responses/sendErrorResponse";
import { formatValidationErrors } from "../../../helpers/functions/formatValidationErrors";
import { StatusCodes } from "../../../helpers/constants/statusCodes";
import bcrypt from "bcrypt";
import { sendSuccessResponse } from "../../../helpers/responses/sendSuccessResponse";
import { IUserAuthenticationResponse } from "../../../helpers/interfaces/IUserAuthenticationResponse.interface";
import jwt from "jsonwebtoken";
import configurations from "../../../config/configurations";
import _ from "lodash";
import { userValidation } from "../../../helpers/validations/user.validation";
import { UserTypeEnum } from "../../../helpers/enums/userType.enum";

const login_handler = async (req: Request, res: Response) => {
  try {
    const validated = await loginValidation.validateAsync(req.body, { abortEarly: false });
    const existedUser = await AppDataSource.manager.findOne(User, {
      where: { email: validated.email, type: UserTypeEnum.ADMIN },
      select: ['email', 'name', 'password', 'id']
  });
    if (existedUser) {
      const passwordCheck = await bcrypt.compare(validated.password, existedUser.password);
      const access_token = jwt.sign({
        user: {
          id: existedUser.id
        }
      }, configurations().secret);
      if (passwordCheck) {
        sendSuccessResponse<IUserAuthenticationResponse>(res, {
          access_token,
          user: {
            name: existedUser.name,
            id: existedUser.id,
          }
        })
      } else {
        sendErrorResponse(["Not Authorized"], res, StatusCodes.NOT_AUTHORIZED);
      }
    } else {
      sendErrorResponse(["Not Authorized"], res, StatusCodes.NOT_AUTHORIZED);
    }
  } catch (e: any) {
    sendErrorResponse(formatValidationErrors(e), res, StatusCodes.NOT_ACCEPTABLE);
  }
};
const register_handler = async (req: Request, res: Response) => {
  try {
    const validated = await userValidation.validateAsync(req.body, { abortEarly: false });
    const existedUser = await AppDataSource.manager.findOneBy(User, { email: validated.email });
    if (existedUser) {
      sendErrorResponse(["User exists"], res, StatusCodes.NOT_ACCEPTABLE);
    } else {
      const userData = {...validated}
      const salt = await bcrypt.genSalt(10)
      userData.password = await bcrypt.hash(validated.password, salt);
      const insertResult = await AppDataSource.manager.insert(User, userData)
      const access_token = jwt.sign({
        user: {
          id: insertResult.generatedMaps[0].id,
          name: validated.name,
        }
      }, configurations().secret);
      validated.id = insertResult.generatedMaps[0].id;
      sendSuccessResponse<IUserAuthenticationResponse>(res, {
        access_token,
        user: _.omit(validated, "password")
      })
    }
  } catch (e: any) {
    sendErrorResponse(formatValidationErrors(e), res, StatusCodes.NOT_ACCEPTABLE);
  }
};
export {
  login_handler,
  register_handler
}
