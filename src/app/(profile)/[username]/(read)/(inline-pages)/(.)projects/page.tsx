import AnimatedBody from '../animated-body';
import { dbProjectToUiProject } from '@server/transforms';
import { UsernameValidation } from '@common/types/UserCredentials';
import { fetchUserGallery, fetchUserProfileByUsername } from '@server/queries';

interface Props {
	params: {
		username: string;
	};
}

export default
async function UsernameInlineProjects(props: Props) {
	const { params: { username: rawUsername } } = props;

	const result = await UsernameValidation.safeParseAsync(rawUsername);

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

	const projects = await fetchUserGallery(username);

	return (
		<AnimatedBody
			username={userProfile.username}
			customItems={userProfile.customItems}
			pageName="projects"
			projects={projects.map(dbProjectToUiProject)}
			journals={[]}
		/>
	);
}
