'use client';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { ProfileButton } from '@components/profile-button';
import ProfileShareButton from '@components/profile-share-button';
import { UiUserProfile } from '@common/types/UserProfile';
import Foo, { SortableItemWrapper } from '../foo';
import { useState } from 'react';
import { CustomProfileItem } from '@common/types/CustomLink';
import { usePushToastMsg } from '@common/atoms';
import updateProfile from '@app/(content)/settings/(.)/update-profile-action';
import { removeItem } from '@common/utils';
import AddContentButton from './add-content-button';
import { UiProject } from '@common/types/Project';
import {
	DetailedBioField,
	ShortBioField,
	TitleField,
} from './text-fields';
import {
	DeleteIcon,
	DragHandleIcon,
	JournalIcon,
	ProjectIcon,
} from '@components/icons';

// TODO Move out of "settings"
import ProfilePhotoUploader from '@app/(content)/settings/(.)/profile-photo-uploader';
import updateProjectsOrder from '../../(read)/(profilePages)/projects/update-projects-order';
import CollpaseAreaToggle from '@components/collapse-area-toggle';

interface Props {
	userProfile: UiUserProfile;
	projects: UiProject[];
}

export default
function UserGalleryEditForm(props: Props) {
	const {
		userProfile,
		projects,
	} = props;
	const pushToastMsg = usePushToastMsg();
	const [links, setLinks] = useState(userProfile.customItems);

	return (
		<>
			<Box paddingTop={1} paddingBottom={2} >
				<Box
					display="flex"
					flexDirection="column"
					alignItems="center"
					justifyContent="center"
				>
					{userProfile.avatar && (
						<Box padding={2}>
							<ProfilePhotoUploader
								avatarUrl={userProfile.avatar}
								username={userProfile.username}
								onUpdate={() => pushToastMsg('Avatar Updated')}
							/>
						</Box>
					)}
					<Typography variant="h5" component="div">
						<TitleField value={userProfile.title} />
					</Typography>
				</Box>
				<Container maxWidth="sm">
					<ShortBioField value={userProfile.shortBio} />
				</Container>
				<Container maxWidth="sm">
					<DetailedBioField value={userProfile.detailedBio} />
				</Container>
			</Box>
			<Box textAlign="center" paddingTop={5} paddingX={2} paddingBottom={15}>
				<ProjectsButton projects={projects}/>
				<ProfileButton
					disabled
					icon={JournalIcon}
				>
					Posts
				</ProfileButton>
				<Foo
					items={links}
					identifier="label"
					onUpdate={handleUpdateProfileItems}
					ItemComponent={({ item }) => (
						<Box position="relative">
							<SortableItemWrapper
								{...item}
							>
								<ProfileButton
									sx={{ cursor: 'inherit' }}
									icon={DragHandleIcon}
									endIcon={
										<DeleteIcon
											color="error"
											// prevent sort drag
											onPointerDown={e => e.preventDefault()}
											onClick={() => handleUpdateProfileItems(removeItem(links, links.findIndex(i => i.label === item.label)))}
											sx={{
												cursor: 'pointer',
												position: 'absolute',
												right: 30,
												top: '50%',
												transform: 'translateY(-50%)',
											}}
										/>
									}
								>
									{item.label}
								</ProfileButton>
							</SortableItemWrapper>
						</Box>
					)}
				/>
				<AddContentButton
					onAddContent={async (item) => {
						handleUpdateProfileItems([
							...links,
							item,
						]);
					}}
				/>
				<ProfileShareButton disabled />
			</Box>
		</>
	);

	async function handleUpdateProfileItems(customItems: CustomProfileItem[]) {
		await updateProfile({ customItems });
		setLinks(customItems);
		pushToastMsg('Updated Links');
	}
}

interface ProjectsButtonProps {
	projects: UiProject[];
}

function ProjectsButton(props: ProjectsButtonProps) {
	const { projects } = props;
	const [isOpen, setIsOpen] = useState(false);

	return (
		<CollpaseAreaToggle
			label="Projects"
			show={isOpen}
			active={isOpen}
			icon={ProjectIcon}
			onButtonClick={() => setIsOpen(!isOpen)}
		>
			<Foo
				items={projects}
				identifier="_id"
				onUpdate={projectOrder =>
					updateProjectsOrder({ projectIdOrder: projectOrder.map(p => p._id) })
				}
				ItemComponent={({ item }) => (
					<SortableItemWrapper {...item}>
						<ProfileButton
							icon={DragHandleIcon}
						>
							{item.title}
						</ProfileButton>
					</SortableItemWrapper>
				)}
			/>
		</CollpaseAreaToggle>
	);
}
