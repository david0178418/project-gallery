import { fetchProject, fetchProjectHasPosts } from '@server/queries';
import { MongoIdValidation } from '@server/validations';
import ListBottom from './list-bottom';
import { ProfileLinkButton } from '@components/profile-button';
import { JournalIcon } from '@components/icons';
import { Paths } from '@common/constants';
import { Box } from '@mui/material';

interface Props {
	params: {
		projectId: string;
	};
}

export default async function ProjectLayout(props: Props) {
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

	const userHasPosts = await fetchProjectHasPosts(project._id.toString());

	return (
		<Box textAlign="center">
			{userHasPosts && (
				<ProfileLinkButton
					prefetch
					icon={JournalIcon}
					href={Paths.ProjectJournals(projectId)}
				>
					Project Posts
				</ProfileLinkButton>
			)}
			<ListBottom project={project} />
		</Box>
	);
}
