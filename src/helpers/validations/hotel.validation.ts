import Joi from "joi";

export const hotelValidation = Joi.object().keys({
  name: Joi.string().alphanum().min(3).required(),
  address: Joi.string().alphanum().min(3).required(),
  stars: Joi.number().min(1).max(5).required(),
})
