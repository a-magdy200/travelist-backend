import { StatusCodes } from "../../helpers/constants/statusCodes"
import { formatValidationErrors } from "../../helpers/functions/formatValidationErrors"
import { sendErrorResponse } from "../../helpers/responses/sendErrorResponse"
import { Request, Response } from 'express'
import { UPLOAD_DIRECTORY } from '../../helpers/constants/directories'
import { IGroupInterface } from "../../helpers/interfaces/IGroup.interface"
import { groupValidation } from "../../helpers/validations/group.validation"
import { AppDataSource } from "../../config/database/data-source"
import { Group } from "../../entities/Group.entity"
import { Country } from "../../entities/Country.entity"
import { sendSuccessResponse } from "../../helpers/responses/sendSuccessResponse"

export const createGroup = async (req: Request, res: Response) => {
   try 
   {
    const bodyObject: IGroupInterface = await groupValidation.validateAsync(
        req.body,
        {
            abortEarly: false,
        }
    )
    const path = `${req.file?.destination}${req.file?.filename}`.replace(
        UPLOAD_DIRECTORY,
        ''
    )
    const group = await AppDataSource.manager.create<Group>(Group, {
        cover_picture: path,
    })

    const country = await AppDataSource.getRepository(Country).findOneBy({
        id: parseInt(bodyObject.countryId),
    })
    if(country)
    {
        group.country = country
        await AppDataSource.manager.save(group)
		sendSuccessResponse<Group>(res, group)

    }
    else
    {
        const error:any=['country not exit ']
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