import { Request, Response } from "express";
import { AppDataSource } from "../../config/database/data-source";
import { Group } from "../../entities/Group.entity";
import { User } from "../../entities/User.entity";
import { StatusCodes } from "../../helpers/constants/statusCodes";
import { formatValidationErrors } from "../../helpers/functions/formatValidationErrors";
import { getUserIdFromToken } from "../../helpers/functions/getUserIdFromToken";
import { sendErrorResponse } from "../../helpers/responses/sendErrorResponse";
import { sendSuccessResponse } from "../../helpers/responses/sendSuccessResponse";

export const addUserGroup = async (req: Request, res: Response) => {

    try
    {
    const groupId: number | undefined = +req.body.groupId
    const userId :number=getUserIdFromToken(req)
    console.log("user")
    console.log(userId)
    const group: Group | null = await AppDataSource.getRepository(
        Group
    ).findOneBy( {
        id:groupId,
    })
    const user = await AppDataSource.getRepository(User).findOneBy({
      id: userId,
    }) 
    if(group && user)
    {
      console.log(user)
      group.followers=[user]
     group.followers_count+=1
      await AppDataSource.manager.save(group)
		  sendSuccessResponse<Group>(res, group)
    }
    else
    {
      const error:any=['not found']
      sendErrorResponse(
        formatValidationErrors(error),
        res,
        StatusCodes.NOT_ACCEPTABLE
      )
    }
    
    }
    catch (error: any) {
		sendErrorResponse(
			formatValidationErrors(error),
			res,
			StatusCodes.NOT_ACCEPTABLE
		)
	}
}
