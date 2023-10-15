
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
	const transporter = createTransport({
		host: SmtpServer,
		port: SmtpPort,
		auth,
	});

	const col = await getCollection(DbCollections.SentEmails);

	col.insertOne({
		date: nowISOString(),
		from: NoReplyEmailAddress,
		...args,
	});

	try {
		await transporter.sendMail({
			from: NoReplyEmailAddress,
			...args,
		});
		console.log(`sendEmail:success:${JSON.stringify(args)}`);
	} catch(e) {
		console.log(`sendEmail:error: ${JSON.stringify(e)}`);
	}
}
