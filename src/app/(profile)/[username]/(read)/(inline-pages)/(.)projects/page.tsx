import AnimatedBody from '../animated-body';
import { dbProjectToUiProject } from '@server/transforms';
import { UsernameValidation } from '@common/types/UserCredentials';
import { fetchUserGallery, fetchUserProfileByUsername } from '@server/queries';
import { Paths } from '@common/constants';
import { JournalIcon, ProjectIcon } from '@components/icons';

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
			rootUrl={Paths.UserGallery(username)}
			collections={[
				{
					active: true,
					key: 'projects',
					label: 'Projects',
					url: Paths.UserGalleryProjects(username),
					icon: ProjectIcon,
					items: projects
						.map(dbProjectToUiProject)
						.map((p) => ({
							...p,
							url: Paths.Project(p._id),
						})),
				},
				{
					key: 'journals',
					label: 'Posts',
					url: Paths.UserGalleryJournals(username),
					icon: JournalIcon,
					items: [],
				},
			]}
		/>
	);
}
