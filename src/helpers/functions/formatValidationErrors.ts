import { ValidationError, ValidationErrorItem } from 'joi'

export const formatValidationErrors = (error: ValidationError): string[] => {
	return error?.details
		? error.details.map((e: ValidationErrorItem) => e.message)
		: [error.message]
}
