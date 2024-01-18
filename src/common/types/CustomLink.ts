import { MaxLinkLabelSize, MinLinkLabelSize } from '@common/constants';
import { ZodSchema, z } from 'zod';

export
interface CustomProfileItem {
	label: string;
	value: string;
	type: 'link' | 'text';
}

export
const CustomLinkValidator: ZodSchema<CustomProfileItem> = z.object({
	label: z
		.string()
		.min(MinLinkLabelSize)
		.max(MaxLinkLabelSize),
}).and(z.union([
	z.object({
		type: z.literal('link'),
		value: z
			.string()
			.url(),
	}),
	z.object({
		type: z.literal('text'),
		value: z
			.string()
			.min(2)
			.max(5000),
	}),
]));
