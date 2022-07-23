const Joi = require('joi')

export const bookingValidation = Joi.object().keys({
	cycleId: Joi.number().required(),
	token: Joi.required(),
	bookingSeats: Joi.number().required(),

})