import { Link as MuiLink } from '@mui/material';
import { Interweave } from 'interweave';
import { polyfill } from 'interweave-ssr';
import Link from 'next/link';
import { forwardRef } from 'react';
import { Paths } from '@common/constants';
import {
	UrlMatcher,
	HashtagMatcher,
	HashtagProps,
	UrlProps,
} from 'interweave-autolink';

polyfill();

interface Props {
	children: string;
}

export
function ParsedContent(props: Props) {
	const { children } = props;

	return (
		<Interweave
			content={children}
			matchers={[new UrlMatcher('url', { validateTLD: false }, Url), new HashtagMatcher('hashtag', {}, Hashtag)]}
		/>
	);
}

function Url(props: UrlProps) {
	const { url } = props;

	return (
		<MuiLink href={url} target="__blank">
			{url}
		</MuiLink>
	);
}

function Hashtag(props: HashtagProps) {
	const { hashtag } = props;

	return (

		<MuiLink
			href={`${Paths.Search}?q=${encodeURIComponent(hashtag)}`}
			component={
				// Hackhackhack
				forwardRef<HTMLAnchorElement>(
					(p, ref) => (
						<Link
							ref={ref}
							href=""
							{...p}
						/>
					)
				)
			}
		>
			{hashtag}
		</MuiLink>

	);
}
