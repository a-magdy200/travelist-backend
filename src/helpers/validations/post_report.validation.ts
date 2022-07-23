import { number } from "joi"

const Joi = require('joi').extend(require('@joi/date'))

export const postReportValidation = Joi.object().keys({
	reason: Joi.string().min(3).required(),
	postId:Joi.number().min(1),


})
