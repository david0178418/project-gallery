import { ObjectId, WithId } from 'mongodb';
import { WithStringId } from '@common/types';

export
type DbUserProfile = WithId<{
	_id: ObjectId;
	shortBio: string
	detailedBio: string;
}>;

export
type UiUserMeta = WithStringId<DbUserProfile>;
