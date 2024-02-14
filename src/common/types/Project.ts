import { WithId } from 'mongodb';
import { WithStringId } from '.';
import { DbJournal, UiJournal } from './Journal';
import { DbUser, UiUser } from './User';
import { CustomProfileItem, CustomLinkValidator } from './CustomLink';
import { IsoDateValidation, MongoIdValidation } from '@server/validations';
import { ZodType, z } from 'zod';
import {
	MaxImageDescriptionLength,
	MaxImageUrlLength,
	MaxJournalProjectTitleLength,
	MaxLabelSize,
	MaxProjectDescriptionLength,
	MinImageUrlLength,
	MinJournalProjectTitleLength,
	MinLabelSize,
	MinProjectDescriptionLength,
	maxLabelCount,
} from '@common/constants';

export
type DbProject = WithId<{
	createdDate: string;
	description: string;
	lastJournalEntry?: Pick<DbJournal, '_id' | 'title'>;
	lastUpdatedDate: string | null;
	owner: Pick<DbUser, '_id' | 'username'>;
	projectCreatedDate: string;
	projectLastUpdatedDate: string;
	title: string;
	unlisted?: boolean;
	images: Array<{
		url: string;
		description: string;
	}>;
	labels: Array<{
		label: string;
	}>;
	customItems: CustomProfileItem[];
}>;

export
type ProjectImage = DbProject['images'][number];

export
type UiProject = WithStringId<Omit<DbProject, 'owner' | 'lastJournalEntry'> & {
	owner: Pick<UiUser, '_id' | 'username'>;
	lastJournalEntry?: Pick<UiJournal, '_id' | 'title'>;
}>;

export
type WriteProject = Pick<UiProject, 'description' | 'title' | 'images' | 'projectCreatedDate' | 'projectLastUpdatedDate' | 'labels' | 'customItems' | 'unlisted'> & {
	_id?: string;
};

export
const WriteProjectValidator: ZodType<WriteProject> = z.object({
	_id: MongoIdValidation.optional(),
	title: z
		.string()
		.min(MinJournalProjectTitleLength, { message: `Project title must be at least ${MinJournalProjectTitleLength} characters long.` })
		.max(MaxJournalProjectTitleLength, { message: `Project title can be no more than ${MaxJournalProjectTitleLength} characters long.` }),
	description: z
		.string()
		.min(MinProjectDescriptionLength, { message: `Project description must be at least ${MinProjectDescriptionLength} characters long.` })
		.max(MaxProjectDescriptionLength, { message: `Project description can be no more than ${MaxProjectDescriptionLength} characters long.` }),
	images: z.array(
		z.object({
			url: z
				.string()
				.min(MinImageUrlLength)
				.max(MaxImageUrlLength),
			description: z
				.string()
				.max(MaxImageDescriptionLength),
		})
	).min(1, { message: 'Projects must have at least one image' }),
	unlisted: z.boolean().default(false),
	labels: z.array(
		z.object({
			label: z
				.string()
				.min(MinLabelSize)
				.max(MaxLabelSize),
		}),
	).max(maxLabelCount),
	customItems: z.array(CustomLinkValidator),
	projectCreatedDate: IsoDateValidation,
	projectLastUpdatedDate: IsoDateValidation,
});
