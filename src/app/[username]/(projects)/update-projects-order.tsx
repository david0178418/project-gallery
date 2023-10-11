'use server';
import { getCollection } from '@server/mongodb';
import { getServerSession } from '@server/auth-options';
import { ObjectId } from 'mongodb';
import { z, ZodType } from 'zod';
import { Enum } from '@common/types';
import { MongoIdValidation } from '@server/validations';
import { fetchUserGalleryOrder } from '@server/queries';
import { moveItemLeft, moveItemRight } from '@common/utils';
import { revalidatePath } from 'next/cache';
import {
	DbCollections,
	Direction,
	Paths,
} from '@common/constants';

type DirectionEnum = Enum<typeof Direction>;

interface Schema {
	projectId: string;
	direction: DirectionEnum;
}

const Validator: ZodType<Schema> = z.object({
	projectId: MongoIdValidation,
	direction: z.union([
		z.literal(Direction.Left),
		z.literal(Direction.Right),
	]),
});

export default
async function updateProjectsOrder(params: Schema) {
	const session = await getServerSession();

	if(!session?.user) {
		return {
			ok: false,
			errors: ['Not logged in'],
		};
	}

	const result = await Validator.safeParseAsync(params);

	if(!result.success) {
		return {
			ok: false,
			errors: result
				.error
				.errors
				.map(e => e.message),
		};
	}

	const {
		projectId,
		direction,
	} = result.data;

	try{
		const col = await getCollection(DbCollections.UserGalleryOrder);
		const order = await fetchUserGalleryOrder(session.user.id);

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

		revalidatePath(Paths.UserGallery(session.user.username));

		return { ok: true };
	} catch(e) {
		return { ok: false };
	}
}
