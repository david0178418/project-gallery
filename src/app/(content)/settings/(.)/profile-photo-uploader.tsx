'use client';
import { red } from '@mui/material/colors';
import { FileUploadCategories } from '@common/constants';
import { Uploader } from '@components/uploader';
import {
	Avatar, Box, Fab,
} from '@ui';
import updateProfile from './update-profile-action';
import { AddAPhotoIcon } from '@components/icons';

interface Props {
	avatarUrl?: string;
	username: string;
}

export default
function ProfilePhotoUploader(props: Props) {
	const {
		avatarUrl,
		username,
	} = props;
	return (
		<Uploader
			category={FileUploadCategories.Profile}
			onAdd={([url]) => url && updateProfile({ avatar: url })}
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
