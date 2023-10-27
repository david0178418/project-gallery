'use server';
import { z, ZodType } from 'zod';
import { getCollection } from '@server/mongodb';
import { getServerSession } from '@server/auth-options';
import { ObjectId } from 'mongodb';
import { WriteProject } from '@common/types/Project';
import { User } from 'next-auth';
import { IsoDateValidation, MongoIdValidation } from '@server/validations';
import { nowISOString } from '@common/utils';
import { revalidatePath } from 'next/cache';
import { updateProfileActivity } from '@server/queries';
import {
	DbCollections,
	MaxJournalProjectTitleLength,
	MinProjectDescriptionLength,
	MinJournalProjectTitleLength,
	MinImageUrlLength,
	MaxImageUrlLength,
	MaxImageDescriptionLength,
	MaxProjectDescriptionLength,
	MaxLinkLabelSize,
	MinLinkLabelSize,
	MinLabelSize,
	MaxLabelSize,
	maxLabelCount,
	Paths,
	ProfileActivity,
} from '@common/constants';

const Validator: ZodType<WriteProject> = z.object({
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
	links: z.array(
		z.object({
			label: z
				.string()
				.min(MinLinkLabelSize)
				.max(MaxLinkLabelSize),
			url: z
				.string()
				.url(),
		}),
	),
	projectCreatedDate: IsoDateValidation,
	projectLastUpdatedDate: IsoDateValidation,
});

export default
async function saveProjectAction(project: WriteProject) {
	const session = await getServerSession();

	if(!session?.user) {
		return {
			ok: false,
			errors: ['Not logged in'],
		};
	}
	const result = await Validator.safeParseAsync(project);

	if(!result.success) {
		return {
			ok: false,
			errors: result
				.error
				.errors
				.map(e => e.message),
		};
	}

	const saveResult = await doSaveProject(session.user, result.data);

	return { ok: !!saveResult };
}

async function doSaveProject(user: User, project: WriteProject) {
	const col = await getCollection(DbCollections.Projects);
	const now = nowISOString();
	const userIdObj = new ObjectId(user.id);
	const {
		_id: projId,
		...updateProps
	} = project;
	const isCreate = !projId;

	const _id = isCreate ?
		new ObjectId() :
		new ObjectId(projId);

	const resultProject = await col.findOneAndUpdate(
		{ _id },
		{
			$set: {
				lastUpdatedDate: now,
				...updateProps,
			},
			$setOnInsert: {
				_id,
				owner: {
					_id: userIdObj,
					username: user.username,
				},
				createdDate: now,
			},
		},
		{ upsert: true }
	);

	if(!resultProject) {
		return null;
	}

	if(!isCreate) {
		const orderCol = await getCollection(DbCollections.UserGalleryOrder);

		await orderCol.updateOne({ _id: userIdObj }, { $push: { projectIdOrder: _id } });
	}

	updateProfileActivity({
		userId: userIdObj,
		activityId: _id,
		label: resultProject.title,
		type: isCreate ?
			ProfileActivity.ProfileCreate :
			ProfileActivity.ProfileUpdate,
	});

	revalidatePath(Paths.Project(_id.toString()));
	revalidatePath(Paths.UserGallery(user.username));

	return _id;
}
