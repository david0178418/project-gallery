import { EditIcon } from '@components/icons';
import Link from 'next/link';
import { getServerSession } from '@server/auth-options';
import { Paths } from '@common/constants';
import Fab from '@mui/material/Fab';

interface Props {
	userId: string;
	href?: string;
}

export default
async function EditButton(props: Props) {
	const {
		userId,
		href = Paths.Settings,
	} = props;

	const session = await getServerSession();
	const isOwner = session?.user.id === userId;

	return isOwner && (
		<Link href={href} >
			<Fab
				color="primary"
				sx={{
					position: 'fixed',
					bottom: 64,
					right: {
						xs: 16,
						sm: 32,
					},
				}}
			>
				<EditIcon />
			</Fab>
		</Link>
	);
}
