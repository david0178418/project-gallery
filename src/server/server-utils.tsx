
import { createTransport } from 'nodemailer';
import { Address } from 'nodemailer/lib/mailer';

const {
	SMTP_PORT = '25',
	SMTP_PW = '',
	SMTP_SERVER = '',
	SMTP_USERNAME = '',
} = process.env;

const auth = (SMTP_USERNAME) ?
	{
		user: SMTP_USERNAME,
		pass: SMTP_PW,
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
		host: SMTP_SERVER,
		port: +SMTP_PORT,
		auth,
	});

	// send mail with defined transport object
	return await transporter.sendMail(args);
}
