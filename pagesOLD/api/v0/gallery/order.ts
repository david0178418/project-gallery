import type { NextApiRequest, NextApiResponse } from 'next';

import { getCollection } from '@server/mongodb';
import { getServerSession } from '@server/auth-options';
import { ObjectId } from 'mongodb';
import { z, ZodType } from 'zod';
import { Enum } from '@common/types';
import { MongoIdValidation } from '@server/validations';
import { fetchUserGalleryOrder } from '@server/queries';
import { moveItemLeft, moveItemRight } from '@common/utils';
import {
	DbCollections,
	Direction,
} from '@common/constants';

type DirectionEnum = Enum<typeof Direction>;

interface Schema {
	projectId: string;
	direction: DirectionEnum;
}

const schema: ZodType<Schema> = z.object({
	projectId: MongoIdValidation,
	direction: z.union([
		z.literal(Direction.Left),
		z.literal(Direction.Right),
	]),
});

export default
async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
	const session = await getServerSession(req, res);

	if(!session?.user) {
		return res.status(401).end();
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

	const {
		projectId,
		direction,
	} = result.data;
	const userId = session.user.id;

	try{
		await updateGalleryOrder(userId, projectId, direction);

		res.send({ ok: true });
	} catch(e) {
		return res
			.status(500)
			.send({ ok: false });
	}
}

async function updateGalleryOrder(userId: string, projectId: string, direction: DirectionEnum) {
	const col = await getCollection(DbCollections.UserGalleryOrder);
	const order = await fetchUserGalleryOrder(userId);

	if(!order) {
		throw 'Gallery order not found';
	}

	const projectIdObjId = new ObjectId(projectId);
	const projectIndex = order.projectIdOrder.findIndex(pId => pId.equals(projectIdObjId));

	await col.updateOne({ _id: order._id }, {
		$set: {
			projectIdOrder: direction === Direction.Left ?
				moveItemLeft(order.projectIdOrder, projectIndex) :
				moveItemRight(order.projectIdOrder, projectIndex),
		},
	});

}
