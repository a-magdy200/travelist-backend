import Joi from "joi";

export const userValidation = Joi.object().keys({
  is_guide: Joi.number().max(1),
  national_id: Joi.number().min(14).max(5),

})
