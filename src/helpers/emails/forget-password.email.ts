import configurations from '../../config/configurations'
import { RESET_PASSWORD } from '../constants/websitePaths'

export const forgetPasswordEmail = (token: string): string => {
	const link= `${configurations().websiteUrl}${RESET_PASSWORD}/${token}`

	return `<h3>please, click the link below to reset your password</h3>
					</b><a href="${link}">${link}</a>`
}
