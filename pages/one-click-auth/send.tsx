import { EmailValidation } from '@common/types/UserCredentials';
import { urlJoin } from '@common/utils';
import { getServerSession } from '@server/auth-options';
import { createUserLoginKey } from '@server/queries';
import { sendEmail } from '@server/server-utils';
import { GetServerSideProps } from 'next';
import {
	BaseUrl,
	Paths,
	SpecialCharacterCodes,
} from '@common/constants';

interface Props {
	email: string;
}

const FullVerifyUrl = urlJoin(BaseUrl, Paths.OneClickAuthVerify);

export
const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
	const session = await getServerSession(ctx.req, ctx.res);

	if(session) {
		return {
			redirect: {
				permanent: false,
				destination: Paths.Home,
			},
		};
	}

	const result = await EmailValidation.safeParseAsync(ctx.query.email);

	if(!result.success) {
		return {
			redirect: {
				permanent: false,
				destination: Paths.Home,
			},
		};
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

	return { props: { email } };
};

export default
function OneClickAuthSendPage(props: Props) {
	return (
		<>
			A login link will be sent to {SpecialCharacterCodes.QUOTE}{props.email}{SpecialCharacterCodes.QUOTE} if an account with this email exists.
		</>
	);
}
