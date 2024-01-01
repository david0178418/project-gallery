import { Box, Typography } from '@ui';
import { fetchProject, fetchProjectJournals } from '@server/queries';
import { MongoIdValidation } from '@server/validations';
import { ProfileLinkButton } from '@components/profile-button';
import { Paths, SpecialCharacterCodes } from '@common/constants';
import ProfileShareButton from '@components/profile-share-button';
import {
	JournalIcon, ProfileIcon, ProjectIcon,
} from '@components/icons';

interface Props {
	params: {
		projectId: string;
	};
}

export default
async function ProjectPage(props: Props) {
	const { params: { projectId } } = props;

	const result = await MongoIdValidation.safeParseAsync(projectId);

	if(!result.success) {
		return (
			<>
				Project not found.
			</>
		);
	}

	const project = result.success ?
		await fetchProject(result.data) :
		null;

	if(!project) {
		return (
			<>
				Project not found.
			</>
		);
	}

	const journals = await fetchProjectJournals(projectId);

	return (
		<Box textAlign="center">
			{!journals.length && (
				<Typography paddingBottom={3}>
					No journal posts yet
				</Typography>
			)}

			<ProfileLinkButton
				icon={ProjectIcon}
				href={Paths.Project(projectId)}
			>
				Project Home
			</ProfileLinkButton>
			{journals.map(j => (
				<ProfileLinkButton
					icon={JournalIcon}
					key={j._id.toString()}
					href={Paths.Journal(j._id.toString())}
				>
					{j.title}
				</ProfileLinkButton>
			))}
			<ProfileLinkButton
				icon={ProfileIcon}
				href={Paths.UserGallery(project.owner.username)}
			>
				{project.owner.username}{SpecialCharacterCodes.RSQUO}s Gallery
			</ProfileLinkButton>
			<ProfileShareButton shareObj={{
				url: Paths.ProjectJournals(projectId),
				label: `${project.title} Project Journals Page`,
				shareMsg: `Check out ${project.title}'s project journals page`,
			}}/>
		</Box>
	);
}
