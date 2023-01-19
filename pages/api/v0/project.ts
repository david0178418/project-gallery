import type { NextApiRequest, NextApiResponse } from 'next';

import { z, ZodType } from 'zod';
import { getCollection } from '@server/mongodb';
import { getServerSession } from '@server/auth-options';
import { ObjectId } from 'mongodb';
import { WriteProject } from '@common/types/Project';
import { User } from 'next-auth';
import { IsoDateValidation, MongoIdValidation } from '@server/validations';
import { nowISOString } from '@common/utils';
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
} from '@common/constants';

interface Schema {
	project: WriteProject;
}

const schema: ZodType<Schema> = z.object({
	project: z.object({
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
	}),
});

export default
async function handler(req: NextApiRequest, res: NextApiResponse) {
	const session = await getServerSession(req, res);

	if(!session) {
		return res.status(400).end();
	}
	const result = await schema.safeParseAsync(req.body);

	if(!result.success) {
		return res
			.status(400)
			.send({
				ok: false,
				errors: result
					.error
					.errors
					.map(e => e.message),
			});
	}

	const project = result.data.project;

	await createProject(session.user, project);

	res.send({ ok: true });
}

async function createProject(user: User, project: WriteProject) {
	const col = await getCollection(DbCollections.Projects);
	const now = nowISOString();
	const userIdObj = new ObjectId(user.id);
	const {
		_id: projId,
		...updateProps
	} = project;
	console.log('updateProps', updateProps);
	const _id = projId ?
		new ObjectId(projId) :
		new ObjectId();

	const result = await col.updateOne(
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

	if(result.upsertedCount) {
		const orderCol = await getCollection(DbCollections.UserGalleryOrder);

		await orderCol.updateOne({ _id: userIdObj }, { $push: { projectIdOrder: _id } });
	}

	return _id;
}
