import Joi from 'joi'

export const hotelReviewValidation = Joi.object().keys({
	// rating: Joi.number().min(1).max(5).required(),
	rating: Joi.string().valid("1","2","3","4","5").required(),
	review: Joi.string().min(3).required(),
	hotelId: Joi.number().min(1).required(),
})
