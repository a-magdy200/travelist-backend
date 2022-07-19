const Joi = require('joi').extend(require('@joi/date'))

export const travelerValidation = Joi.object().keys({
	gender: Joi.string().required(),
	date_of_birth: Joi.date().format('YYYY-MM-DD').required(),
	is_guide: Joi.boolean().default(true).required(),
	national_id: Joi.string().regex(/[0-9]/).length(14).required(),
})
