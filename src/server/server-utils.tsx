
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
	console.log('sendEmail:start');
	const transporter = createTransport({
		host: SmtpServer,
		port: SmtpPort,
		auth,
	});

	console.log('sendEmail:col');
	const col = await getCollection(DbCollections.SentEmails);

	col.insertOne({
		date: nowISOString(),
		from: NoReplyEmailAddress,
		...args,
	});

	try {
		console.log('sendEmail:send');
		await transporter.sendMail({
			from: NoReplyEmailAddress,
			...args,
		});

		console.log('sendEmail:sendDone');
	} catch(e) {
		const loggedError = {
			error: e,
			transportProps: {
				host: SmtpServer,
				port: SmtpPort,
				auth,
			},
		};
		console.log(`sendEmail:error: ${JSON.stringify(loggedError)}`);
	}
	console.log('sendEmail:exiting');
}
