'use client';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from 'next/link';
import Image from 'next/image';
import logo from '@common/images/logo-small.png';
import {
	ComponentProps,
	ElementType,
	HTMLAttributeAnchorTarget,
	ReactNode,
} from 'react';
import {
	CancelIcon,
	LinkIcon,
	SocialFacebookIcon,
	SocialGitHubIcon,
	SocialLinkedInIcon,
	SocialXIcon,
	SocialYouTubeIcon,
} from './icons';

type IconType = typeof CancelIcon;

interface ProfileButtonProps extends BtnProps {
	children: ReactNode;
	onClick? (): void;
}

export
function ProfileButton(props: ProfileButtonProps) {
	return (
		<Box marginBottom={3} color="black">
			<Btn {...props} />
		</Box>
	);
}

interface ProfileLinkButtonProps extends BtnProps {
	children: ReactNode;
	href: string;
	prefetch?: boolean;
	target?: HTMLAttributeAnchorTarget;
}

export
function ProfileLinkButton(props: ProfileLinkButtonProps) {
	const {
		href,
		target,
		prefetch = false,
		...btnProps
	} = props;

	return (
		<Box marginBottom={3} color="black">
			<Link
				prefetch={prefetch}
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
	iconColor?: string;
	component?: ElementType;
}

export
function Btn(props: BtnProps) {
	const {
		href = '',
		icon,
		iconColor,
		sx = {},
		children,
		component,
		...btnProps
	} = props;

	const maybeDomain = extractUrlHost(href);

	const Icon = icon ||
		WebIcons[maybeDomain as keyof typeof WebIcons] ||
		LinkIcon;

	const color = iconColor ||
		(Icon === LinkIcon && '#5271ff') ||
		WebIconColors[maybeDomain] ||
		'inherit';

	return (
		<>
			<Button
				{...btnProps}
				// @ts-ignore
				component={component}
				fullWidth
				size="large"
				variant="outlined"
				color="inherit"
				sx={{
					maxWidth: 600,
					fontSize: 20,
					paddingX: 8,
					...sx,
				}}
			>
				<Icon sx={{
					color,
					position: 'absolute',
					left: 30,
					top: '50%',
					transform: 'translateY(-50%)',
				}}/>
				{children}
			</Button>
		</>
	);
}

const HostnameRegex = /^(?:https?:\/\/)?(?:www\.)?([^/]+)/;

export
function extractUrlHost(str: string) {
	const match = str.match(HostnameRegex);

	return match?.[1]?.toLowerCase() || '';
}

const WebIcons = {
	'facebook.com': SocialFacebookIcon,
	'github.com': SocialGitHubIcon,
	'linkedin.com': SocialLinkedInIcon,
	'twitter.com': SocialXIcon,
	'x.com': SocialXIcon,
	'youtube.com': SocialYouTubeIcon,
	'projectgallery.me': (props: ComponentProps<typeof Box>) => {
		return (
			<Box {...props}>
				<Image
					alt=""
					src={logo}
					width={18}
					height={18}
				/>
			</Box>
		);
	},
};

const WebIconColors: Record<string, string> = {
	'facebook.com': '#4267B2',
	'github.com': '#24292F',
	'linkedin.com': '#0077B5',
	'twitter.com': '#000000',
	'x.com': '#000000',
	'youtube.com': '#FF0000',
};
