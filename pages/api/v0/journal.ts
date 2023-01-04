import type { NextApiRequest, NextApiResponse } from 'next';

import { z, ZodType } from 'zod';
import { getCollection } from '@server/mongodb';
import { getServerSession } from '@server/auth-options';
import { ObjectId } from 'mongodb';
import { MongoIdValidation } from '@server/validations';
import { User } from 'next-auth';
import { WriteJournal } from '@common/types/Journal';
import { nowISOString } from '@common/utils';
import { DbProject } from '@common/types/Project';
import {
	DbCollections,
	MaxProjectSummaryLength,
	MaxJournalProjectTitleLength,
	MinJournalProjectTitleLength,
	MinProjectSummaryLength,
} from '@common/constants';

interface Schema {
	journal: WriteJournal;
}

const publishedJournal = z.object({
	_id: MongoIdValidation.optional(),
	projectId: MongoIdValidation.nullable().optional(),
	publish: z.literal(true),
	title: z
		.string()
		.min(MinJournalProjectTitleLength, { message: `Project title must be at least ${MinJournalProjectTitleLength} characters long.` })
		.max(MaxJournalProjectTitleLength, { message: `Project title can be no more than ${MaxJournalProjectTitleLength} characters long.` }),
	body: z
		.string()
		.min(MinProjectSummaryLength, { message: `Project detail must be at least ${MinProjectSummaryLength} characters long.` })
		.max(MaxProjectSummaryLength, { message: `Project detail can be no more than ${MaxProjectSummaryLength} characters long.` }),
});
const savedJournal = z.object({
	_id: MongoIdValidation.optional(),
	projectId: MongoIdValidation.nullable().optional(),
	publish: z.literal(false).optional(),
	title: z
		.string()
		.max(MaxJournalProjectTitleLength, { message: `Project title can be no more than ${MaxJournalProjectTitleLength} characters long.` }),
	body: z
		.string()
		.max(MaxProjectSummaryLength, { message: `Project detail can be no more than ${MaxProjectSummaryLength} characters long.` }),
});

const schema: ZodType<Schema> = z.object({ journal: publishedJournal.or(savedJournal) });

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

	const { journal: post } = result.data;

	try {
		await createJournalPost(session.user, post);

		res.send({ ok: true });
	} catch {
		res.send({ ok: false });
	}
}

async function createJournalPost(user: User, post: WriteJournal) {
	const col = await getCollection(DbCollections.Journals);
	const now = nowISOString();
	let project: DbProject | undefined = undefined;
	const {
		_id: journalId,
		projectId,
		...updateProps
	} = post;
	const _id = journalId ?
		new ObjectId(journalId) :
		new ObjectId();

	if(projectId) {
		const projectsCol = await getCollection(DbCollections.Projects);

		project = await projectsCol.findOne({ _id: new ObjectId(projectId) }) || undefined;

		if(!project) {
			throw 'Project doesn\'t exist';
		}

		await projectsCol.updateOne({ _id: new ObjectId(projectId) }, {
			$set: {
				lastJournalEntry: {
					_id,
					title: post.title,
				},
			},
		});
	}

	await col.updateOne({ _id }, {
		$set: {
			lastUpdatedDate: now,
			project: project && {
				_id: project._id,
				title: project.title,
			},
			...updateProps,
		},
		$setOnInsert: {
			_id,
			publishedDate: post.publish ? now : null,
			owner: {
				_id: new ObjectId(user.id),
				username: user.username,
			},
		},
	});

	return _id;
}
