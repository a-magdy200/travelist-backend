import Joi from "joi";

export const travelerValidation = Joi.object().keys({
  name: Joi.string().alphanum().min(3).required(),
  address: Joi.string().alphanum().min(3).required(),
 // email: Joi.number().min(1).max(5).required(),
 // profile_picture: Joi.number().min(1).max(5).required(),
})
