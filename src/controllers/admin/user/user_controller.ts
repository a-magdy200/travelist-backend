import { Request, Response } from "express";
import { getUserIdFromToken } from "../../../helpers/functions/getUserIdFromToken";
import { AppDataSource } from "../../../config/database/data-source";
import { User } from "../../../entities/User.entity";
import { sendSuccessResponse } from "../../../helpers/responses/sendSuccessResponse";
import { userProfileValidation, userValidation } from "../../../helpers/validations/user.validation";
import { passwordValidation } from "../../../helpers/validations/password.validation";
import bcrypt from "bcrypt";
import { unlinkSync } from "fs";
import { UPLOAD_DIRECTORY } from "../../../helpers/constants/directories";
import { sendErrorResponse } from "../../../helpers/responses/sendErrorResponse";

const get_profile = async (req: Request, res: Response) => {
  const id = getUserIdFromToken(req);
  const user = await AppDataSource.manager.findOneByOrFail(User, {id});
  sendSuccessResponse<User>(res, user);
}

const update_profile = async (req: Request, res: Response) => {
  const id = getUserIdFromToken(req);
  const validated = await userProfileValidation.validateAsync(req.body, { abortEarly: false });
  await AppDataSource.manager.update(User, {id}, validated);
  sendSuccessResponse(res);
}
const update_password = async (req: Request, res: Response) => {
  const id = getUserIdFromToken(req);
  const validated = await passwordValidation.validateAsync(req.body, { abortEarly: false });
  const salt = await bcrypt.genSalt(10)
  const password = await bcrypt.hash(validated.password, salt);
  await AppDataSource.manager.update(User, {id}, { password });
  sendSuccessResponse(res);
}
const update_profile_picture = async (req: Request, res: Response) => {
  const id = getUserIdFromToken(req);
  if (req.file?.filename) {
    const user = await AppDataSource.manager.findOneByOrFail(User, { id });
    if (user.profile_picture !== '') {
      await unlinkSync(`${UPLOAD_DIRECTORY}${user.profile_picture}`)
    }
    const path = `${req.file.destination}${req.file.filename}`.replace(
      UPLOAD_DIRECTORY,
      ''
    );
    user.profile_picture = path;
    await user.save();
    sendSuccessResponse<string>(res, path);
  } else {
    sendErrorResponse([], res);
  }
}

const update_cover_picture = async (req: Request, res: Response) => {
  const id = getUserIdFromToken(req);
  // await AppDataSource.manager.update(User, {id}, { password });
  sendSuccessResponse(res);
}

export {
  update_profile,
  update_password,
  update_profile_picture,
  update_cover_picture,
  get_profile
}
