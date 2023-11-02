import { ObjectId, WithId } from 'mongodb';
import { WithStringId } from '@common/types';
import { ProfileActivity } from '@common/constants';

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
}>;

export
type UiUserProfile = WithStringId<DbUserProfile>;

export
type WriteUserProfile = Pick<UiUserProfile, 'shortBio' | 'detailedBio' | 'avatar'>;
