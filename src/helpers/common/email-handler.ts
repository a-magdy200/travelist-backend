import { EMAIL_FROM, RESET_PASSWORD_SUBJECT } from '../constants/emailParams'
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
		subject: RESET_PASSWORD_SUBJECT,
		html,
	})
}
