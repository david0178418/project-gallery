'use server';

import S3 from 'aws-sdk/clients/s3';
import { getServerSession } from '@server/auth-options';
import { z, ZodType } from 'zod';
import { makeId } from '@common/utils';
import { FileUploadCategories } from '@common/constants';
import { Enum } from '@common/types';

const OneMB = 1_048_576;

const FileSizeLimitBytes = 1 * OneMB;
const ExpirationSeconds = 5;

interface Params {
	category: Enum<typeof FileUploadCategories>;
	fileType: 'image%2Fpng' | 'image%2Fgif' | 'image%2Fsvg' | 'image%2Fjpeg'; // TODO clean this up
}

const Validator: ZodType<Params> = z.object({
	category: z.union([
		z.literal('profile'),
		z.literal('posts'),
		z.literal('journals'),
	]),
	fileType: z.union([
		z.literal('image%2Fpng'),
		z.literal('image%2Fgif'),
		z.literal('image%2Fsvg'),
		z.literal('image%2Fjpeg'),
	]),
});

export default
async function getUploadUrlAction(params: Params) {
	const session = await getServerSession();

	if(!session) {
		return {
			ok: false,
			error: ['Not logged in'],
		} as const;
	}

	const result = await Validator.safeParseAsync(params);

	if(!result.success) {
		return {
			ok: false,
			errors: result
				.error
				.errors
				.map(e => e.message),
		} as const;
	}

	const {
		category,
		fileType,
	} = result.data;

	const s3 = new S3({
		signatureVersion: 'v4',
		region: process.env.AWS_APP_DEFAULT_REGION,
		endpoint: process.env.AWS_APP_ENDPOINT,
		accessKeyId: process.env.AWS_APP_ACCESS_KEY,
		secretAccessKey: process.env.AWS_APP_SECRET_KEY,
	});

	try {
		const data = await s3.createPresignedPost({
			Bucket: process.env.AWS_APP_BUCKET,
			Expires: ExpirationSeconds,
			Fields: {
				key: `${session.user.id}/${category}/${makeId(36)}`,
				'Content-Type': decodeURIComponent(fileType),
			},
			Conditions: [
				['content-length-range', 0, FileSizeLimitBytes],
			],
		});

		return {
			ok: true,
			data,
		} as const;
	} catch(e) {
		return {
			ok: false,
			e,
		} as const;
	}
}
