import { ObjectId, WithId } from 'mongodb';
import { WithStringId } from '@common/types';
import { ProfileActivity } from '@common/constants';
import { CustomLink } from './CustomLink';

type DbProfileActivityLog = {
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
	lastActivity: DbProfileActivityLog;
	links: CustomLink[];
}>;

type UiProfileActivityLog = {
	date: Date;
	id: string;
	type: ProfileActivity;
	label: string;
};

export
type UiUserProfile = WithStringId<Omit<DbUserProfile, 'lastActivity'>> & {
	lastActivity: UiProfileActivityLog;
};

export
type WriteUserProfile = Pick<UiUserProfile, 'shortBio' | 'detailedBio' | 'avatar' | 'links'>;
