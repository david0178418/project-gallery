'use client';
import { loadingManager } from '@common/atoms';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffectOnce } from '@common/hooks';
import { useState } from 'react';

export default
function Loader() {
	const [isLoading, setIsLoading] = useState(false);

	useEffectOnce(() => {
		loadingManager.subscribe(setIsLoading);
	});

	return (
		<Backdrop
			open={isLoading}
			sx={{
				// Hax fix for issue with backdrop not
				// being removed wihen open is false
				display: isLoading ? 'flex' : 'none',
				color: '#fff',
				zIndex: (theme) => theme.zIndex.modal + 1,
			}}
		>
			<CircularProgress color="inherit" />
		</Backdrop>
	);
}
