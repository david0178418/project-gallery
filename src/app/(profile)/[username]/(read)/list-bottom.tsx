import { Suspense } from 'react';
import { Paths } from '@common/constants';
import ProfileShareButton from '@components/profile-share-button';
import { DbUserProfile } from '@common/types/UserProfile';
import EditButton from '@components/edit-button.server';
import CustomItem from '@components/custom-item';

interface Props {
	userProfile: DbUserProfile;
}

export default
function ListBottom(props: Props) {
	const { userProfile } = props;

	return (
		<>
			{userProfile.customItems.map(i => (
				<CustomItem
					key={i.value}
					item={i}
				/>
			))}
			<ProfileShareButton shareObj={{
				url: Paths.UserGallery(userProfile.username),
				label: `${userProfile.username}'s Project Gallery`,
				shareMsg: `Check out ${userProfile.username}'s Project Gallery`,
			}}/>
			<Suspense>
				<EditButton
					userId={userProfile._id.toString()}
					href={Paths.UserGalleryEdit(userProfile.username)}
				/>
			</Suspense>
		</>
	);
}
