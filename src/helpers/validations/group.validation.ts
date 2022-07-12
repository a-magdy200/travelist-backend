import Joi from 'joi'

export const groupValidation = Joi.object().keys({
	countryId: Joi.string().required(),
	
})
