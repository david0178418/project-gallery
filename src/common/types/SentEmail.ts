import { Address } from 'nodemailer/lib/mailer';

export
interface DbSentEmail {
	date: string;
	from: string | Address;
	response: any;
	html: string;
	subject: string;
	text: string;
	to: string | string[] | Address | Address[]
}
