import { Paths, SpecialCharacterCodes } from '@common/constants';
import EditButton from '@components/edit-button.server';
import { ProfileLinkButton } from '@components/profile-button';
import { ProfileIcon } from '@components/icons';
import ProfileShareButton from '@components/profile-share-button';
import { DbProject } from '@common/types/Project';
import { Suspense } from 'react';

interface Props {
	project: DbProject;
}

export default async function ListBottom(props: Props) {
	const { project } = props;

	const projectId = project._id.toString();

	return (
		<>
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
			<Suspense>
				<EditButton
					userId={project.owner._id.toString()}
					href={Paths.ProjectEdit(projectId)}
				/>
			</Suspense>
		</>
	);
}
