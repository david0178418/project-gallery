'use client';
import { red } from '@mui/material/colors';
import { FileUploadCategories } from '@common/constants';
import { Uploader } from '@components/uploader';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import updateProfile from './update-profile-action';
import { AddAPhotoIcon } from '@components/icons';

interface Props {
	avatarUrl?: string;
	username: string;
	onUpdate?(): void;
}

export default
function ProfilePhotoUploader(props: Props) {
	const {
		avatarUrl,
		username,
		onUpdate,
	} = props;
	return (
		<Uploader
			category={FileUploadCategories.Profile}
			onAdd={async ([url]) => {
				if(!url) {
					return;
				}

				await updateProfile({ avatar: url });
				onUpdate?.();
			}}
		>
			<Box position="relative" display="inline-block">
				<Avatar
					src={avatarUrl}
					sx={{
						bgcolor: red[500],
						width: 100,
						height: 100,
						fontSize: 60,
					}}
				>
					{username[0].toLocaleUpperCase()}
				</Avatar>
				<Fab
					size="small"
					sx={{
						position: 'absolute',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						backgroundColor: '#00000066',
						color: 'white',
						fontSize: 20,
						':hover': { backgroundColor: '#00000099' },
					}}
				>
					<AddAPhotoIcon fontSize="inherit" />
				</Fab>
			</Box>
		</Uploader>
	);
}
