import { EmailValidation } from '@common/types/UserCredentials';
import { urlJoin } from '@common/utils';
import { getServerSession } from '@server/auth-options';
import { createUserLoginKey } from '@server/queries';
import { sendEmail } from '@server/server-utils';
import {
	NextApiRequest,
	NextApiResponse,
} from 'next';
import {
	BaseUrl,
	Paths,
} from '@common/constants';

const FullVerifyUrl = urlJoin(BaseUrl, Paths.OneClickAuth);

export default
async function handler(req: NextApiRequest, res: NextApiResponse) {
	const session = await getServerSession(req, res);

	if(session) {
		return res
			.status(401)
			.send({
				ok: false,
				errors: [
					'You are already logged in.',
				],
			});
	}

	const result = await EmailValidation.safeParseAsync(req.body.email);

	if(!result.success) {
		return res
			.status(500)
			.send({
				ok: false,
				errors: result
					.error
					.errors
					.map(e => e.message),
			});
	}
	const email = result.data;

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
	} else {
		console.log(`OneClickAuthSSend: User with email does not exist: ${email}`);
	}

	res.status(200).send({ ok: true });
}
