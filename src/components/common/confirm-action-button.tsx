'use client';
import { ComponentProps } from 'react';
import { Button } from '@components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogTitle,
	DialogTrigger,
} from '@components/ui/dialog';

interface Props extends Pick<ComponentProps<typeof Button>, 'variant' | 'size'> {
	label: string;
	confirmationMsg: string;
	onConfirm: () => void;
}

export default
function ConfirmActionButton(props: Props) {
	const {
		variant = 'ghost',
		size,
		label,
		onConfirm,
		confirmationMsg,
	} = props;

	async function handleConfirm() {
		await onConfirm();
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					variant={variant}
					size={size}
				>
					{label}
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogTitle>
					{label}
				</DialogTitle>
				<p>
					{confirmationMsg}
				</p>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="ghost">
							Cancel
						</Button>
					</DialogClose>
					<DialogClose asChild>
						<Button onClick={handleConfirm}>
							{label}
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
