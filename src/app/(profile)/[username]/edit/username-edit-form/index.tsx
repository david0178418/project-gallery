'use client';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { ProfileButton, ProfileLinkButton } from '@components/profile-button';
import ProfileShareButton from '@components/profile-share-button';
import { UiUserProfile } from '@common/types/UserProfile';
import Foo, { SortableItemWrapper } from '../foo';
import { useState } from 'react';
import { CustomProfileItem } from '@common/types/CustomLink';
import { toastManager } from '@common/atoms';
import updateProfile from '@app/(content)/settings/(.)/update-profile-action';
import EditContentButton from './add-content-button';
import { UiProject } from '@common/types/Project';
import {
	DetailedBioField,
	ShortBioField,
	TitleField,
} from './text-fields';
import {
	AddIcon,
	DeleteIcon,
	DragHandleIcon,
	EditIcon,
	JournalIcon,
	ProjectIcon,
} from '@components/icons';

// TODO Move out of "settings"
import ProfilePhotoUploader from '@app/(content)/settings/(.)/profile-photo-uploader';
import updateProjectsOrder from '../../(read)/(standalone-pages)/projects/update-projects-order';
import CollpaseAreaToggle from '@components/collapse-area-toggle';
import { Paths } from '@common/constants';
import { DropdownMenu } from '@components/dropdown-menu';
import {
	Divider,
	ListItemIcon, ListItemText, MenuItem,
} from '@mui/material';
import { removeItem } from '@common/utils';
import { EditCustomLinkDialog, EditCustomTextContentDialog } from './edit-custom-content-dialog';

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
	const [links, setLinks] = useState(userProfile.customItems);
	const [activeItem, setActiveItem] = useState<CustomProfileItem | null>(null);

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
								onUpdate={() => toastManager.pushMessage('Avatar Updated')}
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
							<SortableItemWrapper {...item}>
								<ProfileButton
									component="div"
									sx={{ cursor: 'inherit' }}
									icon={DragHandleIcon}
									endIcon={
										<DropdownMenu
											menuProps={{ slotProps: { root: { onPointerDown: e => e.stopPropagation() } } }}
											// hacks to prevent drag/drop from triggering
											onPointerDown={e => e.stopPropagation()}
											sx={{
												cursor: 'pointer',
												position: 'absolute',
												right: 30,
												top: '50%',
												transform: 'translateY(-50%)',
											}}
										>
											<MenuItem onClick={() => setActiveItem(item)}>
												<ListItemIcon>
													<EditIcon fontSize="small" />
												</ListItemIcon>
												<ListItemText>
													Edit
												</ListItemText>
											</MenuItem>
											<Divider />
											<MenuItem onClick={() => handleUpdateProfileItems(removeItem (links, links.findIndex(i => i.label === item.label)))}>
												<ListItemIcon>
													<DeleteIcon fontSize="small" />
												</ListItemIcon>
												<ListItemText>
													Remove
												</ListItemText>
											</MenuItem>
										</DropdownMenu>
									}
								>
									{item.label}
								</ProfileButton>
							</SortableItemWrapper>
						</Box>
					)}
				/>
				<EditContentButton
					onAddContent={async (item) => {
						handleUpdateProfileItems([
							...links,
							item,
						]);
					}}
				/>
				<ProfileShareButton disabled />
			</Box>
			<EditCustomTextContentDialog
				activeItem={activeItem?.type === 'text' ? activeItem : null}
				onUpdate={handleUpdateItem}
				onClose={handleCloseEditDialog}
			/>
			<EditCustomLinkDialog
				activeItem={activeItem?.type === 'link' ? activeItem : null}
				onUpdate={handleUpdateItem}
				onClose={handleCloseEditDialog}
			/>
		</>
	);

	function handleCloseEditDialog() {
		setActiveItem(null);
	}

	function handleUpdateItem(item: CustomProfileItem) {
		handleUpdateProfileItems(links.map(i => i.label === activeItem?.label ? item : i));
		handleCloseEditDialog();
	}

	async function handleUpdateProfileItems(customItems: CustomProfileItem[]) {
		await updateProfile({ customItems });
		setLinks(customItems);
		toastManager.pushMessage('Updated Links');
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
			<ProfileLinkButton
				href={Paths.ProjectEdit()}
				icon={AddIcon}
				color="success"
				sx={{
					borderStyle: 'dashed',
					color: 'green',
				}}
			>
				Add Project
			</ProfileLinkButton>
		</CollpaseAreaToggle>
	);
}
