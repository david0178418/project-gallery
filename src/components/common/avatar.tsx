
import {
	Avatar as ShadCnAvatar,
	AvatarFallback,
	AvatarImage,
} from '@/components/ui/avatar';

interface Props {
	src?: string;
	fallback: string;
}

export default function Avatar(props: Props) {
	const {
		src,
		fallback,
	} = props;

	return (
		<ShadCnAvatar className="bg-red-500">
			<AvatarImage src={src} />
			<AvatarFallback>
				{fallback}
			</AvatarFallback>
		</ShadCnAvatar>
	);
}
