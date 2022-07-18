const Joi = require('joi')

export const friendRequestValidation = Joi.object().keys({
	senderId: Joi.number(),
    recieverId: Joi.number()
    
})