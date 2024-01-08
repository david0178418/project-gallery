import Box from '@mui/material/Box';
import { fetchProject } from '@server/queries';
import { MongoIdValidation } from '@server/validations';
import MarkdownContent from '@components/markdown-content';
import { ProfileLinkButton } from '@components/profile-button';
import ProfileShareButton from '@components/profile-share-button';
import { Paths, SpecialCharacterCodes } from '@common/constants';
import { JournalIcon, ProfileIcon } from '@components/icons';

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
				User not found.
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

	return (
		<>
			{project.description && (
				<Box textAlign="center" paddingBottom={2}>
					<Box maxWidth={600} display="inline-block" textAlign="left">
						<MarkdownContent>
							{project.description}
						</MarkdownContent>
					</Box>
				</Box>
			)}
			<Box textAlign="center">
				<ProfileLinkButton
					icon={JournalIcon}
					href={Paths.ProjectJournals(projectId)}
				>
					Project Posts
				</ProfileLinkButton>
				{project.links.map((l, i) => (
					<ProfileLinkButton
						key={i}
						href={l.url}
						target="_blank"
					>
						{l.label}
					</ProfileLinkButton>
				))}
				<ProfileLinkButton
					icon={ProfileIcon}
					href={Paths.UserGallery(project.owner.username)}
				>
					{project.owner.username}{SpecialCharacterCodes.RSQUO}s Gallery
				</ProfileLinkButton>
				<ProfileShareButton shareObj={{
					url: Paths.Project(projectId),
					label: `${project.title} Project Page`,
					shareMsg: `Check out ${project.title}'s project page`,
				}}/>
			</Box>
		</>
	);
}
