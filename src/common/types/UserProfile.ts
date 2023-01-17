import { WithId } from 'mongodb';
import { WithStringId } from '@common/types';

export
type DbUserProfile = WithId<{
	username: string;
	shortBio: string
	detailedBio: string;
}>;

export
type UiUserProfile = WithStringId<DbUserProfile>;

export
type WriteUserProfile = Pick<UiUserProfile, 'shortBio' | 'detailedBio'>;
