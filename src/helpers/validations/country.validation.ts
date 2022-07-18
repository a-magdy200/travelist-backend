import Joi from 'joi'

export const countryValidation = Joi.object().keys({
	name: Joi.string().min(3).required(),
	id: Joi.number().positive(),
});
