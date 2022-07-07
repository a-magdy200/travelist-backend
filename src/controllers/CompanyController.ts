import { Request, Response } from 'express'
import e, { RequestHandler } from 'express'
import { Company } from '../entities/Company.entity'
import { AppDataSource } from '../config/database/data-source'
import { NotFoundResponse } from '../helpers/responses/404.response'
import {companyValidation} from "../helpers/validations/company.validation";
import { formatValidationErrors } from '../helpers/functions/formatValidationErrors'
import { UPLOAD_DIRECTORY } from '../helpers/constants/directories'
import { unlinkSync } from 'fs'
// import jwt_decode from "jwt-decode";
import jwtDecode, { JwtPayload } from "jwt-decode";
import { decode } from 'punycode'
import { request } from 'http'
import { userInfo } from 'os'
import { object } from 'joi'
const listCompanies = async (req: Request, res: Response) => {
	const hotels: Company[] = await AppDataSource.manager.find<Company>(Company, {
		// withDeleted: true, // to return soft deleted records
	})
	res.json({
		success: true,
		data: hotels,
	})
	
	const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo5LCJuYW1lIjoiRGFoYWIiLCJlbWFpbCI6IkRhaGFiQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiJDJiJDEwJEZMVzhVcno2YlBraGR2MFk0SmdnbE95UGdFQ0o2a0hyUDJCQVBoQy52OUZoR2dpUkxIczc2IiwiYWRkcmVzcyI6IkFsZXhhbmRyaWEiLCJwcm9maWxlX3BpY3R1cmUiOiIiLCJ0eXBlIjoiY29tcGFueSJ9LCJpYXQiOjE2NTcxMjA5NDZ9.9O7lgiwLsmGIsRf1-O8vlT57feVzsZxcGH4JdT0UUmQ";
	let decoded : object
	  decoded = jwtDecode(token);
	
    //  decoded.user.id;
	console.log(decoded);	
}

const viewCompanyProfile: RequestHandler = async (req, res) => {
	const company = await AppDataSource.getRepository(Company).findOne({
		where: {
			id: parseInt(req.params.id),
		},
		relations: {
			user: true,
		},
	})

	const userFromToken = {
		id: 3,
	}
	let returnvalue
	if (company?.id == userFromToken.id){
		res.json({
			success: true,
			data: company,
		})
	} 
	// if (company?.id == userFromToken.id) {
	// 	// view my profile as company
	// 	returnvalue = {
	// 		identification: '',
	// 		description: '',
	// 		rate: '',
	// 		cover_picture: '',
	// 		user: '',
	// 	}
	// }
	// view other company profile
	else {
		returnvalue = {
			identification: '',
			description: '',
		}
	}
	res.send(returnvalue)
}
const editCompanyProfile = async (req: Request, res: Response) => {
	try {
	  const id: number | undefined = +req.params.id;
	  const validation: Company = await companyValidation.validateAsync(req.body, { abortEarly: false });
	  const updateResult = await AppDataSource.manager.update<Company>(Company, {
		id
	  }, validation);
  
	  res.json({
		success: updateResult.affected === 1,
	  });
	} catch (error: any) {
	  res.json(formatValidationErrors(error));
	}
  }
  const uploadCoverPicture = async (req: Request, res: Response) => {
	const id: number | undefined = +req.params.id
	const company: Company | null = await AppDataSource.manager.findOneBy<Company>(Company, {
		id,
	})
	if (company && req.file?.filename) {
		// Remove `uploads/` from path string
		const oldProfilePicture = company.cover_picture
		if (oldProfilePicture && oldProfilePicture !== '') {
			await unlinkSync(`${UPLOAD_DIRECTORY}${oldProfilePicture}`)
		}
		const path = `${req.file.destination}${req.file.filename}`.replace(
			UPLOAD_DIRECTORY,
			''
		)
		company.cover_picture = path
		await company.save()
		res.json({
			success: true,
			path,
		})
	} else {
		res.json(NotFoundResponse)
	}
}
// const getTokenString = async(req:any) => {
// 	const tokenString = req.headers.authorization;
// 	if (!tokenString) {
// 	  throw new Error('Expected \'headers.authorization\' parameter to be set');
// 	}
// 	const match = tokenString.match(/^Bearer (.*)$/i);
// 	if (!match || match.length < 2) {
// 	  throw new Error(`Invalid Authorization token - '${tokenString}' does not match 'Bearer .*'`);
// 	}
// 	req.jwt = {token: match[2], payload: decode(match[2])};
// 	const decodes = decode(req.jwt)
// 	// return match[1];
// 	console.log(decodes)
//   }
// export const displayByCompany: RequestHandler = async (req, res) => {
//   const results = await AppDataSource.getRepository(Company).findOneBy({
//     id: parseInt(req.params.id),
//   });
//   // if(!results) res.status(404).send('The Company with the given id was not found');
//   res.send(results);
// };
export {listCompanies,viewCompanyProfile,editCompanyProfile,uploadCoverPicture}
