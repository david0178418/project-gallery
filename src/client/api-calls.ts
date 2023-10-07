import type { ApiResponse, Enum } from '@common/types';

import { signIn, signOut } from 'next-auth/react';
import { get, post } from '@client/client-utils';
import { urlJoin } from '@common/utils';
import getUploadUrlAction from './get-upload-url-action';
import {
	ApiUrl,
	AuthProviders,
	FileUploadCategories,
} from '@common/constants';

export
async function login(username: string, password: string) {
	return signIn(AuthProviders.Creds, {
		username,
		password,
		redirect: false,
	});
}

export
async function logout() {
	await signOut();
}

export
async function dismissNotification(id: string): Promise<void> {
	await apiGet('/user/notifications/dismiss', { id });
}

export
function apiPost<T = any>(path: string, requestBody?: any) {
	return post<T>(urlJoin(ApiUrl, path), requestBody);
}

function apiGet<T = any>(path: string, params?: any, signal?: AbortSignal) {
	return get<T>(urlJoin(ApiUrl, path), params, signal);
}

export
async function postFile(file: File, category: Enum<typeof FileUploadCategories>): Promise<ApiResponse<{url: string}>> {
	// TODO figure out how I want to handle bridging these types
	const fileType: any = encodeURIComponent(file.type);

	const res = await getUploadUrlAction({
		category,
		fileType,
	});

	if(!res?.ok) {
		return {
			ok: false,
			errors: res?.errors,
		};
	}

	const {
		url,
		fields,
	} = res.data;

	const formData = new FormData();

	Object.entries({
		...fields,
		file,
	}).forEach(([key, value]) => {
		formData.append(key, value as string);
	});

	try {
		await fetch(url, {
			method: 'POST',
			headers: {
				'X-Amz-Algorithm': fields['X-Amz-Algorithm'],
				'X-Amz-Credential': fields['X-Amz-Credential'],
				'X-Amz-Date': fields['X-Amz-Date'],
				'X-Amz-Signature': fields['X-Amz-Signature'],
			},
			body: formData,
		});
		return {
			ok: true,
			data: { url: urlJoin(url, fields.key) },
		};
	} catch {
		return { ok: false };
	}

}
