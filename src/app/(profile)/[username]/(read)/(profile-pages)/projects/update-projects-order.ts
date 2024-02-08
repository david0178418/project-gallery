'use server';
import { getCollection } from '@server/mongodb';
import { getServerSession } from '@server/auth-options';
import { ObjectId } from 'mongodb';
import { z, ZodType } from 'zod';
import { MongoIdValidation } from '@server/validations';
import { fetchUserGalleryOrder } from '@server/queries';
import { moveItemLeft, moveItemRight } from '@common/utils';
import {
	DbCollections,
	Direction,
	DirectionEnum,
	Paths,
} from '@common/constants';
import { revalidatePath } from 'next/cache';

type Schema = {
	projectId: string;
	direction: DirectionEnum;
} | {
	projectIdOrder: string[];
};

const Validator: ZodType<Schema> = z.object({
	projectId: MongoIdValidation,
	direction: z.union([
		z.literal(Direction.Left),
		z.literal(Direction.Right),
	]),
}).or(
	z.object({ projectIdOrder: z.array(MongoIdValidation) }),
);

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

	const order = await fetchUserGalleryOrder(session.user.id);

	if(!order) {
		throw 'Gallery order not found';
	}

	let projectIdOrder: ObjectId[] = [];

	if('projectIdOrder' in result.data) {
		projectIdOrder = result.data.projectIdOrder.map(id => new ObjectId(id));
	} else {
		// TODO Kill this branch
		const {
			projectId,
			direction,
		} = result.data;

		const projectIdObjId = new ObjectId(projectId);
		const projectIndex = order.projectIdOrder.findIndex(pId => pId.equals(projectIdObjId));

		projectIdOrder = direction === Direction.Left ?
			moveItemLeft(order.projectIdOrder, projectIndex) :
			moveItemRight(order.projectIdOrder, projectIndex);
	}

	try{
		const col = await getCollection(DbCollections.UserGalleryOrder);

		await col.updateOne({ _id: order._id }, { $set: { projectIdOrder } });

		// TODO: Review this functionality to ensure this is
		// actually needed here with the current flow
		revalidatePath(Paths.UserGallery(session.user.username));
		revalidatePath(Paths.UserGalleryProjects(session.user.username));

		return { ok: true };
	} catch(e) {
		return { ok: false };
	}
}
