import { Request, Response } from "express";
import { AppDataSource } from "../../config/database/data-source";
import { Group } from "../../entities/Group.entity";
import { StatusCodes } from "../../helpers/constants/statusCodes";
import { formatValidationErrors } from "../../helpers/functions/formatValidationErrors";
import { IGroupInterface } from "../../helpers/interfaces/IGroup.interface";
import { sendErrorResponse } from "../../helpers/responses/sendErrorResponse";
import { sendSuccessResponse } from "../../helpers/responses/sendSuccessResponse";
import { UPLOAD_DIRECTORY } from "../../helpers/constants/directories";
import { unlinkSync } from "fs";

export const updateGroup = async (req: Request, res: Response) => {

    try
    {
		const id: number | undefined = +req.params.id
        const bodyObject: IGroupInterface = { ...req.body }
        const group: Group | null = await AppDataSource.getRepository(
			Group
		).findOneBy( {
			id,
		})
        if(group)
        {
            if (req.file?.filename) {
				const oldCoverPicture = group.cover_picture
				if (oldCoverPicture && oldCoverPicture !== '') {
					await unlinkSync(`${UPLOAD_DIRECTORY}${oldCoverPicture}`)
				}
				group.cover_picture = `${req.file.destination}${req.file.filename}`.replace(
					UPLOAD_DIRECTORY,
					''
				)
			}
			await group.save()

			sendSuccessResponse<Group>(res, group)

        }
        else
        {
            const error:any=['group not exit ']
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