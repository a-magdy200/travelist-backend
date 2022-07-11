import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import configurations from "../config/configurations";
import { sendErrorResponse } from "../helpers/responses/sendErrorResponse";
import { StatusCodes } from "../helpers/constants/statusCodes";
import { formatValidationErrors } from "../helpers/functions/formatValidationErrors";

const isAuthenticated = async (
  req: Request,
  res: Response,
  next: () => void
) => {
  const bearerHeader = req.headers["authorization"];

  if (bearerHeader !== undefined && bearerHeader.includes("Bearer ")) {
    const Token = bearerHeader.split(" ")[1];
    try {
      jwt.verify(
        Token,
        configurations().secret,
        // (err: any) => {
        //   if (err) {
        //     sendErrorResponse(["Not Authorized"], res, StatusCodes.NOT_AUTHORIZED);
        //   } else {
        //     next();
        //   }
        // }
      );
      next();
    } catch (e: any) {
      sendErrorResponse(formatValidationErrors(e), res, StatusCodes.NOT_AUTHORIZED);
    }
  } else {
    sendErrorResponse(["Not Authorized"], res, StatusCodes.NOT_AUTHORIZED);
  }
};

export { isAuthenticated };
