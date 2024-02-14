import AnimatedBody, { AnimatedBodyCollection } from '../animated-body';
import { UsernameValidation } from '@common/types/UserCredentials';
import { dbJournalToUiJournal } from '@server/transforms';
import { Paths } from '@common/constants';
import { JournalIcon, ProjectIcon } from '@components/icons';
import {
	fetchUserHasProjectsByUsername,
	fetchUserJournals,
	fetchUserProfileByUsername,
} from '@server/queries';

interface Props {
	params: {
		username: string;
	};
}

export default
async function UsernameInputJournals(props: Props) {
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

	const [journals, userHasProjects] = await Promise.all([
		fetchUserJournals(username),
		fetchUserHasProjectsByUsername(username),
	]);

	const collections: AnimatedBodyCollection[] = [
		{
			active: true,
			key: 'journals',
			label: 'Posts',
			url: Paths.UserGalleryJournals(username),
			icon: JournalIcon,
			items: journals
				.map(dbJournalToUiJournal)
				.map((j) => ({
					...j,
					url: Paths.Journal(j._id),
				})),
		},
	];

	if(userHasProjects) {
		collections.unshift({
			key: 'projects',
			label: 'Projects',
			url: Paths.UserGalleryProjects(username),
			icon: ProjectIcon,
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
