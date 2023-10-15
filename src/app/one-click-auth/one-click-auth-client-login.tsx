'use client';
import { AuthProviders, Paths } from '@common/constants';
import { useEffectOnce } from '@common/hooks';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default
function OneClickAuthClientLogin() {
	const { replace } = useRouter();
	const [finished, setFinished] = useState(false);
	const params = useSearchParams();
	const key = params.get('k');

	useEffectOnce(() => {
		signIn(AuthProviders.OneClick, {
			key,
			redirect: false,
		}).then(result => {
			const success = !!result?.ok;

			if(success) {
				replace(Paths.Home);
			} else {
				setFinished(true);
			}
		});
	});

	return (
		<>
			{finished ? (
				<>
					Login failed.
				</>
			) : (
				<>
					Logging in.
				</>
			)}
		</>
	);
}
