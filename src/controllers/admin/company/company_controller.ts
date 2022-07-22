import { Request, Response } from 'express'
import { AppDataSource } from '../../../config/database/data-source'
import { Company } from '../../../entities/Company.entity'
import { sendNotFoundResponse } from '../../../helpers/responses/404.response'
import { companyValidation } from '../../../helpers/validations/company.validation'
import { formatValidationErrors } from '../../../helpers/functions/formatValidationErrors'
import { sendErrorResponse } from '../../../helpers/responses/sendErrorResponse'
import { StatusCodes } from '../../../helpers/constants/statusCodes'
import { sendSuccessResponse } from "../../../helpers/responses/sendSuccessResponse";
import { Group } from "../../../entities/Group.entity";
import { InsertResult } from "typeorm";

const listCompanies = async (req: Request, res: Response) => {
  const companies: Company[] = await AppDataSource.manager.find<Company>(Company)
  sendSuccessResponse<Company[]>(res, companies);
}

const showCompany = async (req: Request, res: Response) => {
  const id: number | undefined = +req.params.id
  const company: Company | null = await AppDataSource.manager.findOne<Company>(
    Company,
    {
      where: {id,},
      relations: ["user", "programs", "programs.cycles", "programs.cycles.bookings"]
    }
  )
  if (company) {
    sendSuccessResponse<Company>(res, company);
  } else {
    sendNotFoundResponse(res)
  }
}

const updateCompany = async (req: Request, res: Response) => {
  try {
    const id: number | undefined = +req.params.id
    const validation: Company = await companyValidation.validateAsync(req.body, {
      abortEarly: false,
    })
    await AppDataSource.manager.update<Company>(
      Company,
      {
        id,
      },
      validation
    )
    sendSuccessResponse(res);
  } catch (error: any) {
    sendErrorResponse(
      formatValidationErrors(error),
      res,
      StatusCodes.NOT_ACCEPTABLE
    )
  }
}
const deleteCompany = async (req: Request, res: Response) => {
  try {
    const id: number | undefined = +req.params.id
    await AppDataSource.manager.delete<Group>(Group, {
      company: {id},
    })
    await AppDataSource.manager.delete<Company>(Company, {
      id,
    })
    sendSuccessResponse(res);
  } catch (error: any) {
    sendErrorResponse(
      formatValidationErrors(error),
      res,
      StatusCodes.NOT_ACCEPTABLE
    )
  }
}
const createCompany = async (req: Request, res: Response) => {
  try {
    const validation: Company = await companyValidation.validateAsync(req.body, {
      abortEarly: false,
    })
    const companyInsertResult: InsertResult = await AppDataSource.manager.insert<Company>(Company, validation)
    const companyId = companyInsertResult.generatedMaps[0].id;

    sendSuccessResponse(res);
  } catch (error: any) {
    sendErrorResponse(
      formatValidationErrors(error),
      res,
      StatusCodes.NOT_ACCEPTABLE
    )
  }
}
export {
  createCompany,
  deleteCompany,
  listCompanies,
  showCompany,
  updateCompany,
}
