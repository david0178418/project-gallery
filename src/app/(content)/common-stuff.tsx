'use client';
import Loader from '@components/loader';
import { Toaster } from 'sonner';

export default
function CommonStuff() {
	return (
		<>
			<Toaster />
			<Loader />
		</>
	);
}
