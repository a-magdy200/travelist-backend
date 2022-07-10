import { EMAIL_FROM, VERIFY_CODE_SUBJECT } from '../constants/emailParams'
import transporter from '../../config/transporter'
import { IEmailParamsInterface } from '../interfaces/IEmailParams.interface'

export const emailHandler = async ({
	email,
	html,
	subject,
}: IEmailParamsInterface) => {
	await transporter.sendMail({
		from: EMAIL_FROM,
		to: email,
		subject: VERIFY_CODE_SUBJECT,
		html,
	})
}
