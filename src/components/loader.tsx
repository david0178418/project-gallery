import { loadingAtom } from '@common/atoms';
import { useAtomValue } from 'jotai';
import {
	Backdrop,
	CircularProgress,
} from '@mui/material';

export default
function Loader() {
	const loading = useAtomValue(loadingAtom);

	return (
		<Backdrop
			open={loading}
			sx={{
				// Hax fix for issue with backdrop not
				// being removed wihen open is false
				display: loading ? 'flex' : 'none',
				color: '#fff',
				zIndex: (theme) => theme.zIndex.modal + 1,
			}}
		>
			<CircularProgress color="inherit" />
		</Backdrop>
	);
}
