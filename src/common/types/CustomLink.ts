import { MaxLinkLabelSize, MinLinkLabelSize } from '@common/constants';
import { z } from 'zod';

export
interface CustomLink {
	label: string;
	url: string;
}

export
const CustomLinkValidator = z.object({
	label: z
		.string()
		.min(MinLinkLabelSize)
		.max(MaxLinkLabelSize),
	url: z
		.string()
		.url(),
});
