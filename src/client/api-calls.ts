import type { ApiResponse, Enum } from '@common/types';

import { signIn, signOut } from 'next-auth/react';
import { get, post } from '@client/client-utils';
import { urlJoin } from '@common/utils';
import { UiProject, WriteProject } from '@common/types/Project';
import { WriteJournal } from '@common/types/Journal';
import {
	ApiUrl,
	AuthProviders,
	Direction,
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
async function sendLoginLink(email: string) {
	return post('/api/auth/one-click/send', { email });
}

export
function updateProjectOrder(projectId: string, direction: Enum<typeof Direction>) {
	return apiPost<ApiResponse>('/gallery/order', {
		projectId,
		direction,
	});
}

export
async function logout() {
	await signOut();
}

export
async function getNotificaitons(): Promise<Notification[]> {
	const result = await apiGet<ApiResponse<{notifications: Notification[]}>>('/user/notifications');

	return result?.ok ?
		result.data.notifications :
		[];

}

export
function projectSave(project: WriteProject) {
	return apiPost('/project', { project });
}

export
function journalSave(journal: WriteJournal) {
	return apiPost('/journal', { journal });
}

export
function getProjects() {
	return apiGet<ApiResponse<{projects: UiProject[]}>>('/projects');
}

export
async function dismissNotification(id: string): Promise<void> {
	await apiGet('/user/notifications/dismiss', { id });
}

function apiPost<T = any>(path: string, requestBody?: any) {
	return post<T>(urlJoin(ApiUrl, path), requestBody);
}

function apiGet<T = any>(path: string, params?: any, signal?: AbortSignal) {
	return get<T>(urlJoin(ApiUrl, path), params, signal);
}

interface Foo {
	url: string;
	fields: any;
}

export
async function postFile(file: File, category: Enum<typeof FileUploadCategories>): Promise<ApiResponse<{url: string}>> {
	const fileName = encodeURIComponent(file.name);
	const fileType = encodeURIComponent(file.type);

	const res = await apiGet<ApiResponse<Foo>>('upload-url', {
		file: fileName,
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
