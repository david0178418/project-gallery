import { UsernameValidation } from '@common/types/UserCredentials';
import MarkdownContent from '@components/markdown-content';
import { fetchUserProfileByUsername } from '@server/queries';

interface Props {
	params: {
		username: string;
	};
}

export default
async function UserAboutPage(props: Props) {
	const { params: { username } } = props;
	const result = await UsernameValidation.safeParseAsync(username);

	const userProfile = result.success ?
		await fetchUserProfileByUsername(username) :
		null;

	if(!userProfile) {
		return (
			<div>
				Invalid User
			</div>
		);
	}

	return (
		<MarkdownContent>
			{userProfile.detailedBio}
		</MarkdownContent>
	);
}
