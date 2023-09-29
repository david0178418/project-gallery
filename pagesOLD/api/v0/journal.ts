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
	MaxJournalProjectTitleLength,
	MinJournalProjectTitleLength,
	MinJournalPostLength,
	MaxJournalPostLength,
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
		.min(MinJournalProjectTitleLength, { message: `Journal title must be at least ${MinJournalProjectTitleLength} characters long.` })
		.max(MaxJournalProjectTitleLength, { message: `Journal title can be no more than ${MaxJournalProjectTitleLength} characters long.` }),
	body: z
		.string()
		.min(MinJournalPostLength, { message: `Journal post must be at least ${MinJournalPostLength} characters long.` })
		.max(MaxJournalPostLength, { message: `Journal post can be no more than ${MaxJournalPostLength} characters long.` }),
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
		.max(MaxJournalPostLength, { message: `Journal post can be no more than ${MaxJournalPostLength} characters long.` }),
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
		res.status(500).send({ ok: false });
	}
}

async function createJournalPost(user: User, post: WriteJournal) {
	const col = await getCollection(DbCollections.Journals);
	const now = nowISOString();
	let project: DbProject | undefined = undefined;
	const {
		_id: journalId,
		projectId,
		publish,
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

		if(publish) {
			// only attach if published
			// TODO More logic around updates to cover situations like updating
			// old posts over writing old posts
			await projectsCol.updateOne({ _id: new ObjectId(projectId) }, {
				$set: {
					lastJournalEntry: {
						_id,
						title: post.title,
					},
				},
			});
		}
	}

	const existingJournal = await col.findOne({ _id });

	await col.updateOne(
		{ _id },
		{
			$set: {
				lastUpdatedDate: now,
				// TODO Fix this mess
				publishedDate: existingJournal?.publishedDate || (publish ? now : null),
				project: project && {
					_id: project._id,
					title: project.title,
				},
				...updateProps,
			},
			$setOnInsert: {
				_id,
				owner: {
					_id: new ObjectId(user.id),
					username: user.username,
				},
			},
		},
		{ upsert: true }
	);

	return _id;
}
