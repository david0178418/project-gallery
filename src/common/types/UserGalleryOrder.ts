import { ObjectId } from 'mongodb';

export
interface DbUserGalleryOrder {
	usernameLower: string;
	projectIdOrder: ObjectId[];
}

export
interface UiUserGalleryOrder extends Omit<DbUserGalleryOrder, 'projectIdOrder'> {
	projectIdOrder: string[]
}
