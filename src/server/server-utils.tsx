
import { createTransport } from 'nodemailer';
import { Address } from 'nodemailer/lib/mailer';
import {
	SmtpPort,
	SmtpPw,
	SmtpServer,
	SmtpUsername,
} from '@common/constants';

const auth = (SmtpUsername) ?
	{
		user: SmtpUsername,
		pass: SmtpPw,
	} :
	undefined;

interface SendEmailArgs {
	from: string | Address;
	html: string;
	subject: string;
	text: string;
	to: string | string[] | Address | Address[];
}

export
async function sendEmail(args: SendEmailArgs) {
	const transporter = createTransport({
		host: SmtpServer,
		port: SmtpPort,
		auth,
	});

	// send mail with defined transport object
	return await transporter.sendMail(args);
}
