import { Interweave } from 'interweave';
import { polyfill } from 'interweave-ssr';
import { UrlMatcher, UrlProps } from 'interweave-autolink';
import Link from 'next/link';

polyfill();

interface Props {
	children: string;
}

export
function ParsedContent(props: Props) {
	const { children } = props;

	return (
		<Interweave
			className="parsed-user-content"
			content={children}
			matchers={[
				new UrlMatcher('url', { validateTLD: false }, Url),
				// new HashtagMatcher('hashtag', {}, Hashtag)
			]}
		/>
	);
}

function Url(props: UrlProps) {
	const { url } = props;

	return (
		<Link href={url} target="__blank">
			{url}
		</Link>
	);
}

// function Hashtag(props: HashtagProps) {
// 	const { hashtag } = props;

// 	return (

// 		<MuiLink
// 			href={`${Paths.Search}?q=${encodeURIComponent(hashtag)}`}
// 			component={
// 				// Hackhackhack
// 				forwardRef<HTMLAnchorElement>(
// 					(p, ref) => (
// 						<Link
// 							ref={ref}
// 							href=""
// 							{...p}
// 						/>
// 					)
// 				)
// 			}
// 		>
// 			{hashtag}
// 		</MuiLink>

// 	);
// }
