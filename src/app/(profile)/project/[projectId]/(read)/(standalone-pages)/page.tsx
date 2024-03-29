import Box from '@mui/material/Box';
import { fetchProject } from '@server/queries';
import { MongoIdValidation } from '@server/validations';
import { ProfileButton, ProfileLinkButton } from '@components/profile-button';
import { Paths } from '@common/constants';
import { JournalIcon } from '@components/icons';
import { Fragment } from 'react';

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
			<Box textAlign="center">
				<ProfileLinkButton
					icon={JournalIcon}
					href={Paths.ProjectJournals(projectId)}
				>
					Project Posts
				</ProfileLinkButton>
				{project.customItems.map((l, i) => (
					<Fragment key={i}>
						{l.type === 'link' && (
							<ProfileLinkButton
								href={l.value}
								target="_blank"
							>
								{l.label}
							</ProfileLinkButton>
						)}
						{l.type === 'text' && (
							<ProfileButton>
								{l.label}
							</ProfileButton>
						)}
					</Fragment>
				))}
			</Box>
		</>
	);
}
