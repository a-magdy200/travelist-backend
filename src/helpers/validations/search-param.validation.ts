import Joi from 'joi';

export const searchParamValidation = Joi.object().keys({
	keyword: Joi.string().alphanum().required()
});
