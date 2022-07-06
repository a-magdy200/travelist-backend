import { ValidationError, ValidationErrorItem } from 'joi'

export const formatValidationErrors = (error: ValidationError) => {
	// TODO:: Handle
	return {
		success: false,
		errors: error?.details
			? error.details.map((e: ValidationErrorItem) => e.message)
			: [error.message],
	}
}