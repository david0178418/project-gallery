import AnimatedBody from '../animated-body';
import { UsernameValidation } from '@common/types/UserCredentials';
import { fetchUserProfileByUsername } from '@server/queries';

interface Props {
	params: {
		username: string;
	};
}

export default
async function UsernameJournals(props: Props) {
	const { params: { username: rawUsername } } = props;

	const result = await UsernameValidation.safeParseAsync(rawUsername);

	// Should be unnecessary since this should be handled in layout.
	if(!result.success) {
		return (
			<>
				Invalid.
			</>
		);
	}

	const { data: username } = result;

	const userProfile = await fetchUserProfileByUsername(username);

	// Should be unnecessary since this should be handled in layout.
	if(!userProfile) {
		return (
			<>
				User not found.
			</>
		);
	}

	return (
		<AnimatedBody
			username={userProfile.username}
			links={userProfile.links}
			pageName="about"
			projects={[]}
			journals={[]}
			about={userProfile.detailedBio}
		/>
	);
}
