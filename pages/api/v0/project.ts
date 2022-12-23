import type { NextApiRequest, NextApiResponse } from 'next';

import { z, ZodType } from 'zod';
import { getCollection } from '@server/mongodb';
import { getServerSession } from '@server/auth-options';
import { ObjectId } from 'mongodb';
import { WriteProject } from '@common/types/Project';
import { IsoDateValidation, MongoIdValidation } from '@server/validations';
import {
	DbCollections,
	MaxProjectSummaryLength,
	MaxProjectTitleLength,
	MinProjectDetailLength,
	MinProjectSummaryLength,
	MinProjectTitleLength,
} from '@common/constants';
import {
	nowISOString,
	random,
} from '@common/utils';
import { User } from 'next-auth';

interface Schema {
	project: WriteProject;
}

const schema: ZodType<Schema> = z.object({
	project: z.object({
		_id: MongoIdValidation.optional(),
		title: z
			.string()
			.min(MinProjectTitleLength, { message: `Project title must be at least ${MinProjectTitleLength} characters long.` })
			.max(MaxProjectTitleLength, { message: `Project title can be no more than ${MaxProjectTitleLength} characters long.` }),
		detail: z
			.string()
			.min(MinProjectDetailLength, { message: `Project detail must be at least ${MinProjectDetailLength} characters long.` })
			.max(MaxProjectSummaryLength, { message: `Project detail can be no more than ${MaxProjectSummaryLength} characters long.` }),
		summary: z
			.string()
			.min(MinProjectSummaryLength, { message: `Project summary must be at least ${MinProjectSummaryLength} characters long.` })
			.max(MaxProjectSummaryLength, { message: `Project summary can be no more than ${MaxProjectSummaryLength} characters long.` }),
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

	await createPost(session.user, project);

	res.send({ ok: true });
}

async function createPost(user: User, project: WriteProject) {
	const col = await getCollection(DbCollections.Projects);
	const now = nowISOString();
	const _id = project._id ?
		new ObjectId(project._id) :
		new ObjectId();

	await col
		.insertOne({
			...project,
			_id,
			owner: {
				_id: new ObjectId(user.id),
				username: user.username,
			},
			createdDate: now,
			lastUpdatedDate: now,
			titleImageUrl: `https://placebacon.net/400/300?image=${random(0, 9)}`,
		});

	return _id;
}
