import { Request, Response } from 'express'
import { AppDataSource } from '../../../config/database/data-source'
import { sendNotFoundResponse } from '../../../helpers/responses/404.response'
import { groupValidation } from '../../../helpers/validations/group.validation'
import { formatValidationErrors } from '../../../helpers/functions/formatValidationErrors'
import { sendErrorResponse } from '../../../helpers/responses/sendErrorResponse'
import { StatusCodes } from '../../../helpers/constants/statusCodes'
import { sendSuccessResponse } from "../../../helpers/responses/sendSuccessResponse";
import { Group } from "../../../entities/Group.entity";
import { IGroupInterface } from "../../../helpers/interfaces/IGroup.interface";
import logger from "../../../config/logger";

const listGroups = async (req: Request, res: Response) => {
	try {
		const count: number = await AppDataSource.getRepository<Group>(Group).count();
		if (count === 0) {
			sendSuccessResponse<IGroupInterface[]>(res, []);
		} else {
			const groups: IGroupInterface[] = await AppDataSource.getRepository<Group>(Group)
				.createQueryBuilder("group")
				.innerJoin("group.country", "country")
				.leftJoin("group.posts", "post")
				.select([
					"group.id as id",
					"country.name as countryName",
					"COUNT(post.id) as postsCount"
				])
				.getRawMany();
			sendSuccessResponse<IGroupInterface[]>(res, groups);
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
const showGroup = async (req: Request, res: Response) => {
	const id: number | undefined = +req.params.id
	try {
		const group: Group | null = await AppDataSource.manager.findOneOrFail<Group>(
			Group,
			{
				where: { id },
				relations: ["posts", "country", "posts.traveler"]
			}
		);
		sendSuccessResponse<Group>(res, group);

	}
	catch (error: any) {
		sendErrorResponse(
			formatValidationErrors(error),
			res,
			StatusCodes.NOT_ACCEPTABLE
		)
	}
}

const updateGroup = async (req: Request, res: Response) => {
	try {
		const id: number | undefined = +req.params.id
		const validation: Group = await groupValidation.validateAsync(req.body, {
			abortEarly: false,
		})
		await AppDataSource.manager.update<Group>(
			Group,
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
const deleteGroup = async (req: Request, res: Response) => {
	try {
		const id: number | undefined = +req.params.id
		await AppDataSource.manager.softDelete<Group>(Group, {
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
const createGroup = async (req: Request, res: Response) => {
	try {
		const validation: Group = await groupValidation.validateAsync(req.body, {
			abortEarly: false,
		})
		const group = await AppDataSource.manager.create<Group>(Group, validation)
		await group.save()
		sendSuccessResponse<Group>(res, group);
	} catch (error: any) {
		sendErrorResponse(
			formatValidationErrors(error),
			res,
			StatusCodes.NOT_ACCEPTABLE
		)
	}
}
export {
	createGroup,
	deleteGroup,
	listGroups,
	showGroup,
	updateGroup,
}
