const Joi = require('joi')

export const cycleReviewValidation = Joi.object().keys({
	cycleId: Joi.number().min(1).required(),
    review:Joi.string().min(5).required(),
    rating: Joi.number().min(1).max(5).required(),


})