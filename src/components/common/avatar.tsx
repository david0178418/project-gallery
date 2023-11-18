
import {
	Avatar as ShadCnAvatar,
	AvatarFallback,
	AvatarImage,
} from '@/components/ui/avatar';
import { cn } from '@/src/lib/utils';

interface Props {
	src?: string;
	fallback: string;
	className?: string;
}

export default function Avatar(props: Props) {
	const {
		src,
		fallback,
		className = '',
	} = props;

	return (
		<ShadCnAvatar className={cn('bg-red-500', className)}>
			<AvatarImage className="object-cover" src={src} />
			<AvatarFallback>
				{fallback}
			</AvatarFallback>
		</ShadCnAvatar>
	);
}
