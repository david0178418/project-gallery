import { ObjectId, WithId } from 'mongodb';
import { WithStringId } from '@common/types';
import { CustomLink } from './CustomLink';
import { z } from 'zod';
import {
	ProfileActivity,
	UserProfileTitleMaxLength,
	UserProfileTitleMinLength,
} from '@common/constants';

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
	displayName: string;
	title: string;
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
type WriteUserProfile = Pick<UiUserProfile, 'shortBio' | 'detailedBio' | 'title' | 'displayName' | 'avatar' | 'links'>;

export
const UserProfileTitleValidation = z
	.string()
	.min(UserProfileTitleMinLength, `Must be at least ${UserProfileTitleMinLength} characters.`)
	.max(UserProfileTitleMaxLength, `Can be no more than ${UserProfileTitleMaxLength} characters.`);
