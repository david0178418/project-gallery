'use client';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { ProfileButton } from '@components/profile-button';
import ProfileShareButton from '@components/profile-share-button';
import { TextFieldLengthValidation } from '@components/common/text-field-length-validation';
import { UiUserProfile } from '@common/types/UserProfile';
import Foo, { SortableItemWrapper } from './foo';
import { useState } from 'react';
import { CustomLink } from '@common/types/CustomLink';
import { usePushToastMsg } from '@common/atoms';
import { useDebouncedCallback } from '@common/hooks';
import updateProfile from '@app/(content)/settings/(.)/update-profile-action';
import {
	MaxUserProfileBioLength,
	MaxUserProfileShortBioLength,
	SpecialCharacterCodes,
} from '@common/constants';
import {
	AddIcon,
	CloseIcon,
	DeleteIcon,
	DragHandleIcon,
	JournalIcon,
	ProjectIcon,
} from '@components/icons';

// TODO Move out of "settings"
import ProfilePhotoUploader from '@app/(content)/settings/(.)/profile-photo-uploader';
import {
	Dialog, DialogContent, DialogTitle, IconButton,
} from '@mui/material';
import LinkForm from '@app/(content)/project/[projectId]/edit/edit-project.form/link-form';
import { removeItem } from '@common/utils';

interface Props {
	userProfile: UiUserProfile;
}

export default
function UserGalleryEditForm(props: Props) {
	const { userProfile } = props;
	const pushToastMsg = usePushToastMsg();
	const [links, setLinks] = useState(userProfile.links);

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
						{userProfile.username}{SpecialCharacterCodes.RSQUO}s Gallery
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
				<ProfileButton
					disabled
					icon={ProjectIcon}
				>
					Projects
				</ProfileButton>
				<ProfileButton
					disabled
					icon={JournalIcon}
				>
					Posts
				</ProfileButton>
				<Foo
					items={links}
					identifier="url"
					onUpdate={handleUpdateLinks}
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
											onClick={() => handleUpdateLinks(removeItem(links, links.findIndex(i => i.url === item.url)))}
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
				<AddLinks
					onAddLink={async (label, url) => {
						handleUpdateLinks([
							...links,
							{
								label,
								url,
							},
						]);
					}}
				/>
				<ProfileShareButton disabled />
			</Box>
		</>
	);

	async function handleUpdateLinks(updatedLinks: CustomLink[]) {
		await updateProfile({ links: updatedLinks });
		setLinks(updatedLinks);
		pushToastMsg('Updated Links');
	}
}

interface ShortBioFieldProps {
	value: string
}

function ShortBioField(props: ShortBioFieldProps) {
	const pushToastMsg = usePushToastMsg();
	const [persistedValue, setPersistedValue] = useState(props.value);
	const [value, setValue] = useState(persistedValue);

	useDebouncedCallback(value, 750, async () => {
		if(value === persistedValue) {
			return;
		}

		await updateProfile({ shortBio: value });

		pushToastMsg({
			message: 'Summary Updated',
			delay: 1500,
		});
		setPersistedValue(value);
	});

	return (
		<TextFieldLengthValidation
			fullWidth
			multiline
			autoComplete="off"
			label="Bio summary"
			variant="standard"
			margin="normal"
			type="text"
			minRows={3}
			maxLength={MaxUserProfileShortBioLength}
			value={value}
			onChange={e => setValue(e.target.value)}
		/>
	);
}

interface DetailedBioFieldProps {
	value: string
}

function DetailedBioField(props: DetailedBioFieldProps) {
	const pushToastMsg = usePushToastMsg();
	const [persistedValue, setPersistedValue] = useState(props.value);
	const [value, setValue] = useState(persistedValue);

	useDebouncedCallback(value, 750, async () => {
		if(value === persistedValue) {
			return;
		}

		await updateProfile({ detailedBio: value });

		pushToastMsg({
			message: 'Detailed Bio Updated',
			delay: 1500,
		});
		setPersistedValue(value);
	});

	return (
		<TextFieldLengthValidation
			fullWidth
			multiline
			autoComplete="off"
			label="Full Bio"
			variant="standard"
			margin="normal"
			type="text"
			minRows={6}
			maxLength={MaxUserProfileBioLength}
			value={value}
			onChange={e => setValue(e.target.value)}
		/>
	);
}

interface AddLinksProps {
	onAddLink(label: string, url: string): void;
}

function AddLinks({ onAddLink }: AddLinksProps) {
	const [open, setIsOpen] = useState(false);

	return (
		<>
			<ProfileButton
				icon={AddIcon}
				onClick={() => setIsOpen(true)}
				sx={{
					borderStyle: 'dashed',
					color: 'green',
				}}
			>
				Add Link
			</ProfileButton>
			<Dialog
				open={open}
				onClose={() => setIsOpen(false)}
			>
				<DialogTitle>
					Create Link
					<IconButton
						sx={{ float: 'right' }}
						onClick={() => setIsOpen(false)}
					>
						<CloseIcon/>
					</IconButton>
				</DialogTitle>
				<DialogContent sx={{ textAlign: 'right' }}>
					<LinkForm
						focus
						onAdd={(label, url) => {
							onAddLink(label, url);
							setIsOpen(false);
						}}
					/>
				</DialogContent>
			</Dialog>
		</>
	);
}
