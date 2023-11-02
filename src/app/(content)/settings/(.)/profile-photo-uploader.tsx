'use client';
import { red } from '@mui/material/colors';
import { FileUploadCategories } from '@common/constants';
import { Uploader } from '@components/uploader';
import { Avatar, Fab } from '@ui';
import updateProfile from './update-profile-action';
import { FileUploadIcon } from '@components/icons';
import { Badge } from '@ui';

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
			<Badge
				overlap="circular"
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'right',
				}}
				badgeContent={
					<Fab color="primary" size="small">
						<FileUploadIcon/>
					</Fab>
				}
			>
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
			</Badge>
		</Uploader>
	);
}
