'use client';
import { Box, Button } from '@ui';
import Link from 'next/link';
import {
	ComponentProps,
	HTMLAttributeAnchorTarget,
	ReactNode,
} from 'react';

interface ProfileButtonProps {
	children: ReactNode;
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
				<Btn {...btnProps} />
			</Link>
		</Box>
	);
}

function Btn(props: ComponentProps<typeof Button>) {
	return (
		<Button
			{...props}
			fullWidth
			size="large"
			variant="outlined"
			color="inherit"
			sx={{
				maxWidth: 600,
				fontSize: 20,
			}}
		/>
	);
}
