import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import configurations from "../config/configurations";
import { sendErrorResponse } from "../helpers/responses/sendErrorResponse";
import { StatusCodes } from "../helpers/constants/statusCodes";
import { formatValidationErrors } from "../helpers/functions/formatValidationErrors";
import { getUserIdFromToken } from "../helpers/functions/getUserIdFromToken";
import { AppDataSource } from "../config/database/data-source";
import { User } from "../entities/User.entity";
import { UserTypeEnum } from "../helpers/enums/userType.enum";

const isAdmin = async (
  req: Request,
  res: Response,
  next: () => void
) => {
  const id = getUserIdFromToken(req);
  if (id) {
    try {
    await AppDataSource.manager.findOneByOrFail(User, {
      id,
      type: UserTypeEnum.ADMIN
    })
      next();
    } catch (e: any) {
      sendErrorResponse(formatValidationErrors(e), res, StatusCodes.NOT_AUTHORIZED);
    }
  } else {
    sendErrorResponse(["Not Authorized"], res, StatusCodes.NOT_AUTHORIZED);
  }
};

export { isAdmin };
