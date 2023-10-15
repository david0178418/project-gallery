'use server';
import { EmailValidation } from '@common/types/UserCredentials';
import { urlJoin } from '@common/utils';
import { getServerSession } from '@server/auth-options';
import { createUserLoginKey } from '@server/queries';
import { sendEmail } from '@server/server-utils';
import { BaseUrl, Paths } from '@common/constants';

const FullVerifyUrl = urlJoin(BaseUrl, Paths.OneClickAuth);

export default
async function oneClickSendAction(email: string) {
	const session = await getServerSession();

	if(session) {
		return {
			ok: false,
			errors: [
				'You are already logged in.',
			],
		};
	}

	const result = await EmailValidation.safeParseAsync(email);

	if(!result.success) {
		return {
			ok: false,
			errors: result
				.error
				.errors
				.map(e => e.message),
		};
	}

	const key = await createUserLoginKey(email);

	if(key) {
		const oneClickUrl = `${FullVerifyUrl}?k=${key}`;

		sendEmail({
			subject: 'Your ProjectGallery.Me Login Link',
			text: `Login Link: ${oneClickUrl}`,
			to: [email],
			html: `
				<a href="${oneClickUrl}" target="_blank">Click here to sign in to your ProjectGallery.Me account</a>.
			`,
		});
	}

	return { ok: true };
}
