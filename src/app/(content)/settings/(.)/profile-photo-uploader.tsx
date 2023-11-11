'use client';
import { FileUploadCategories } from '@common/constants';
import { Uploader } from '@components/uploader';
import updateProfile from './update-profile-action';
import { AddAPhotoIcon } from '@components/icons';
import Fab from '@components/common/fab';
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from '@components/ui/avatar';

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
			<div className="relative inline-block">
				<Avatar className="bg-red-500 w-96 h-96 text-xl">
					<AvatarImage src={avatarUrl} />
					<AvatarFallback>
						{username[0].toLocaleUpperCase()}
					</AvatarFallback>
				</Avatar>
				<Fab
					// size="small"
					// sx={{
					// 	position: 'absolute',
					// 	top: '50%',
					// 	left: '50%',
					// 	transform: 'translate(-50%, -50%)',
					// 	backgroundColor: '#00000066',
					// 	color: 'white',
					// 	fontSize: 20,
					// 	':hover': { backgroundColor: '#00000099' },
					// }}
				>
					<AddAPhotoIcon fontSize="inherit" />
				</Fab>
			</div>
		</Uploader>
	);
}
