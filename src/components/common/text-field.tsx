import { type ComponentProps } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface Props extends ComponentProps<typeof Input> {
	label?: string;
	placeholder?: string;
	helperText?: string;
	error?: boolean;
}

const TextErrorClass = 'text-pink-600';
const InputErrorClass = `${TextErrorClass} border-pink-500 focus:border-pink-500 focus:ring-pink-500`;

export default
function TextField(props: Props) {
	const {
		label,
		placeholder,
		helperText,
		error = false,
		...rest
	} = props;
	const id = label?.toLowerCase();

	return (
		<div className="grid pt-1 pb-3 w-full max-w-sm items-center gap-1.5">
			{label && (
				<Label htmlFor={id}>{label}</Label>
			)}
			<Input
				type="text"
				className={cn({ [InputErrorClass]: error })}
				id={id}
				placeholder={placeholder}
				{...rest}
			/>
			{helperText && (
				<div className={cn('text-sm italic', { 'text-pink': error })}>
					{helperText}
				</div>
			)}
		</div>
	);
}
