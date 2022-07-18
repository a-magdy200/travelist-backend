const Joi = require('joi').extend(require('@joi/date'))

export const postValidation = Joi.object().keys({
	content: Joi.string().min(3).required(),
	status: Joi.string().valid('active', 'inactive','reported','closed').default('active'),
	groupId: Joi.number().min(1),
})
