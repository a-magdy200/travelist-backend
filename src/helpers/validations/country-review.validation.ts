import Joi from 'joi'

export const countryReviewValidation = Joi.object().keys({
	rating: Joi.number().min(1).max(5).required(),
	review: Joi.string().min(3).required(),
	countryId: Joi.number().min(1).required(),
})
