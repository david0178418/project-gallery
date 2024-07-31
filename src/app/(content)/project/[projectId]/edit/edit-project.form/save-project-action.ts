'use server';
import { getCollection } from '@server/mongodb';
import { getServerSession } from '@server/auth-options';
import { ObjectId } from 'mongodb';
import { WriteProject, WriteProjectValidator } from '@common/types/Project';
import { User } from 'next-auth';
import { nowISOString } from '@common/utils';
import { revalidatePath } from 'next/cache';
import { updateProfileActivity } from '@server/queries';
import {
	DbCollections,
	Paths,
	ProfileActivity,
} from '@common/constants';

export default
async function saveProjectAction(project: WriteProject) {
	const session = await getServerSession();

	if(!session?.user) {
		return {
			ok: false,
			errors: ['Not logged in'],
		};
	}
	const result = await WriteProjectValidator.safeParseAsync(project);

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
		{
			upsert: true,
			returnDocument: 'after',
		}
	);

	if(!resultProject) {
		return null;
	}

	if(isCreate) {
		const orderCol = await getCollection(DbCollections.UserGalleryOrder);

		await orderCol.updateOne({ _id: userIdObj }, { $push: { projectIdOrder: _id } });
	}

	updateProfileActivity({
		userId: userIdObj,
		activityId: _id,
		label: resultProject.title,
		type: isCreate ?
			ProfileActivity.ProfileCreate :
			ProfileActivity.ProjectUpdate,
	});

	revalidatePath(Paths.Project(_id.toString()));
	revalidatePath(Paths.UserGallery(user.username));

	return _id;
}
