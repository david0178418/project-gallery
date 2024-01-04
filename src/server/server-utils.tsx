
import { createTransport } from 'nodemailer';
import { Address } from 'nodemailer/lib/mailer';
import { getCollection } from './mongodb';
import { nowISOString } from '@common/utils';
import {
	DbCollections,
	NoReplyEmailAddress,
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
	from?: string | Address;
	html: string;
	subject: string;
	text: string;
	to: string | string[] | Address | Address[];
}

export
async function sendEmail(args: SendEmailArgs) {
	console.log('called sendEmail');
	const transporter = createTransport({
		host: SmtpServer,
		port: SmtpPort,
		auth,
	});

	try {
		const response = await transporter.sendMail({
			from: NoReplyEmailAddress,
			...args,
		});

		const col = await getCollection(DbCollections.SentEmails);

		col.insertOne({
			date: nowISOString(),
			from: NoReplyEmailAddress,
			response,
			...args,
		});

		console.log(`sendEmail:success:${JSON.stringify(args)}::${JSON.stringify(response)}`);
	} catch(e) {
		console.log(`sendEmail:error: ${JSON.stringify(e)}`);
	}
}
