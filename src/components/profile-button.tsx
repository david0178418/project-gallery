'use client';
import { Box, Button } from '@ui';
import Link from 'next/link';
import {
	ComponentProps,
	HTMLAttributeAnchorTarget,
	ReactNode,
} from 'react';
import {
	CancelIcon,
	LinkIcon,
	SocialFacebookIcon,
	SocialGitHubIcon,
	SocialLinkedInIcon,
	SocialTwitterIcon,
	SocialYouTubeIcon,
} from './icons';

type IconType = typeof CancelIcon;

interface ProfileButtonProps {
	children: ReactNode;
	icon?: IconType;
	onClick? (): void;
}

export default
function ProfileButton(props: ProfileButtonProps) {
	return (
		<Box marginBottom={3} color="black">
			<Btn {...props} />
		</Box>
	);
}

interface ProfileLinkButtonProps {
	children: ReactNode;
	href: string;
	icon?: IconType;
	target?: HTMLAttributeAnchorTarget;
}

export
function ProfileLinkButton(props: ProfileLinkButtonProps) {
	const {
		href,
		target,
		...btnProps
	} = props;

	return (
		<Box marginBottom={3} color="black">
			<Link
				prefetch={false}
				href={href}
				target={target}
			>
				<Btn
					href={href}
					{...btnProps}
				/>
			</Link>
		</Box>
	);
}

interface BtnProps extends ComponentProps<typeof Button> {
	icon?: IconType;
}

function Btn(props: BtnProps) {
	const {
		href = '',
		icon,
		...btnProps
	} = props;

	const Icon = icon ||
		WebIccons[extractUrlHost(href)] ||
		LinkIcon;

	return (
		<Button
			{...btnProps}
			fullWidth
			size="large"
			variant="outlined"
			color="inherit"
			sx={{
				maxWidth: 600,
				fontSize: 20,
				paddingX: 8,
			}}
			startIcon={
				<Icon sx={{
					position: 'absolute',
					left: 30,
					top: '50%',
					transform: 'translateY(-50%)',
				}}/>
			}
		/>
	);
}

const HostnameRegex = /^(?:https?:\/\/)?(?:www\.)?([^/]+)/;

export
function extractUrlHost(str: string) {
	const match = str.match(HostnameRegex);

	return match?.[1]?.toLowerCase() || '';
}

const WebIccons: Record<string, typeof SocialFacebookIcon> = {
	'facebook.com': SocialFacebookIcon,
	'github.com': SocialGitHubIcon,
	'linkedin.com': SocialLinkedInIcon,
	'twitter.com': SocialTwitterIcon,
	'youtube.com': SocialYouTubeIcon,
};
