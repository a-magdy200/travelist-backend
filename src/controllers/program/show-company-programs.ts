import { Program } from '../../entities/Program.entity'
import { AppDataSource } from '../../config/database/data-source'
import { Request, Response } from 'express'
import { sendSuccessResponse } from "../../helpers/responses/sendSuccessResponse";
import { getUserIdFromToken } from '../../helpers/functions/getUserIdFromToken';
import { Company } from '../../entities/Company.entity';
import { sendNotFoundResponse } from '../../helpers/responses/404.response';

export const showCompanyPrograms = async (req: Request, res: Response) => {

    const userId: number = getUserIdFromToken(req)
	const company = await AppDataSource.getRepository(Company).findOne({
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
