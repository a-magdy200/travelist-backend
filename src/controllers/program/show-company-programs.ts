import { Program } from '../../entities/Program.entity'
import { AppDataSource } from '../../config/database/data-source'
import { Request, Response } from 'express'
import { sendSuccessResponse } from "../../helpers/responses/sendSuccessResponse";
import { getUserIdFromToken } from '../../helpers/functions/getUserIdFromToken';
import { Company } from '../../entities/Company.entity';
import { sendNotFoundResponse } from '../../helpers/responses/404.response';
import { sendErrorResponse } from '../../helpers/responses/sendErrorResponse';
import { formatValidationErrors } from '../../helpers/functions/formatValidationErrors';
import { StatusCodes } from '../../helpers/constants/statusCodes';

export const showCompanyPrograms = async (req: Request, res: Response) => {

    const userId: number = getUserIdFromToken(req)
	try{
    const company = await AppDataSource.getRepository(Company).findOneOrFail({
		where: {
			userId: userId
		},
	})
    if(company){	
    
        const companyPrograms:Program[]  = await AppDataSource.getRepository(Program).find({
            
            where:{
                company:{id:company.id},
              },
              relations: ["company","company.user", "cycles", "hotels", "transportation", "country"],
        
           })
           sendSuccessResponse<Program[]>(res, companyPrograms)
        
        }
        else
        {
            sendNotFoundResponse(res)
    
        }
	}
    catch (e: any) {
        sendErrorResponse(
            formatValidationErrors(e),
            res,
            StatusCodes.BAD_REQUEST
        )
    }
}
