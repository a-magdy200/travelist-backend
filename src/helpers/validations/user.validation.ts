import Joi from "joi";

export const userValidation = Joi.object().keys({
  name: Joi.string().alphanum().min(3).required(),
  email:Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
  address: Joi.string().alphanum().min(3).required(),
 // profile_picture: Joi.number().min(1).max(5).required(),

})
