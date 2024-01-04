
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
		console.log('aaaaaaa');
		const response = await transporter.sendMail({
			from: NoReplyEmailAddress,
			...args,
		});

		console.log(111);
		const col = await getCollection(DbCollections.SentEmails);

		console.log(2222);
		await col.insertOne({
			date: nowISOString(),
			from: NoReplyEmailAddress,
			response,
			...args,
		});
		console.log(3333);

		console.log(`sendEmail:success:${JSON.stringify(args)}::${JSON.stringify(response)}`);
	} catch(e) {
		console.error(`sendEmail:error: ${JSON.stringify(e)}`);
	}
}
