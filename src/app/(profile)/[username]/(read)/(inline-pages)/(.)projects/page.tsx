import AnimatedBody, { AnimatedBodyCollection } from '../animated-body';
import { dbProjectToUiProject } from '@server/transforms';
import { UsernameValidation } from '@common/types/UserCredentials';
import { Paths } from '@common/constants';
import { JournalIcon, ProjectIcon } from '@components/icons';
import {
	fetchUserGallery,
	fetchUserHasPostsByUsername,
	fetchUserProfileByUsername,
} from '@server/queries';

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

	const [projects, userHasPosts] = await Promise.all([
		fetchUserGallery(username),
		fetchUserHasPostsByUsername(username),
	]);

	const collections: AnimatedBodyCollection[] = [
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
	];

	if(userHasPosts) {
		collections.push(
			{
				key: 'journals',
				label: 'Posts',
				url: Paths.UserGalleryJournals(username),
				icon: JournalIcon,
				items: [],
			});
	}

	return (
		<AnimatedBody
			rootUrl={Paths.UserGallery(username)}
			collections={collections}
		/>
	);
}
