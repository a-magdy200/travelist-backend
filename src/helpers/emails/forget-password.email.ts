import configurations from '../../config/configurations'
import { VERIFY_CODE } from '../constants/websitePaths'

export const forgetPasswordEmail = (code: string): string => {
	return `<p>please, copy the attached code to verify your account, code: </p> <b>
					${code}
					</b><p> Click: <a href='${
						configurations().websiteUrl
					}${VERIFY_CODE}'>Here</a></p>`
}
