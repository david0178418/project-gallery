import { z } from 'zod';
import { isISOString } from '@common/utils';

export
const MongoIdValidation = z
	.string()
	.trim()
	.length(24);

export
const IsoDateValidation = z
	.string()
	.refine(isISOString, { message: 'Not a valid ISO string date ' });
