const Joi = require('joi')

export const bookingValidation = Joi.object().keys({
	cycleId: Joi.number().required(),
    is_paid: Joi.boolean().required()
})