const Joi = require('joi').extend(require('@joi/date'))

export const travelerValidation = Joi.object().keys({
	gender: Joi.string().required(),
	date_of_birth: Joi.date().format('YYYY-MM-DD').required(),
	is_guide: Joi.string().valid("0", "1").required(),
	// gender &type
	national_id: Joi.string().regex(/[0-9]/).length(14).required(),
})
