import { ObjectId, WithId } from 'mongodb';
import { WithStringId } from '@common/types';
import { ProfileActivity } from '@common/constants';
import { CustomLink } from './CustomLink';

type ProfileActivityLog = {
	date: Date;
	id: ObjectId;
	type: ProfileActivity;
	label: string;
};

export
type DbUserProfile = WithId<{
	avatar?: string;
	username: string;
	shortBio: string
	detailedBio: string;
	lastActivity: ProfileActivityLog;
	links: CustomLink[];
}>;

export
type UiUserProfile = WithStringId<DbUserProfile>;

export
type WriteUserProfile = Pick<UiUserProfile, 'shortBio' | 'detailedBio' | 'avatar' | 'links'>;
