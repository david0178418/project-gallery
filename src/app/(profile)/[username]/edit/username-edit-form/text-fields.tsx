'use client';
import { TextFieldLengthValidation } from '@components/common/text-field-length-validation';
import { useState } from 'react';
import { usePushToastMsg } from '@common/atoms';
import { useDebouncedCallback } from '@common/hooks';
import updateProfile from '@app/(content)/settings/(.)/update-profile-action';
import MarkdownContent from '@components/markdown-content';
import { Tabs, Tab } from '@mui/material';
import { UserProfileTitleValidation } from '@common/types/UserProfile';
import {
	MaxUserProfileBioLength,
	MaxUserProfileShortBioLength,
	UsernameMaxLength,
	UsernameMinLength,
} from '@common/constants';

interface TitleFieldProps {
	value: string
}

export
function TitleField(props: TitleFieldProps) {
	const pushToastMsg = usePushToastMsg();
	const [persistedValue, setPersistedValue] = useState(props.value);
	const [value, setValue] = useState(persistedValue);
	const [errorMsg, setErrorMsg] = useState('');

	useDebouncedCallback(value, 750, async () => {
		if(value === persistedValue) {
			return;
		}

		const result = UserProfileTitleValidation.safeParse(value);

		if(!result.success) {
			setErrorMsg(result.error.format()._errors[0] || 'Something went wrong');
			return;
		}

		await updateProfile({ title: value });

		pushToastMsg({
			message: 'Title Updated',
			delay: 1500,
		});
		setPersistedValue(value);
	});

	return (
		<TextFieldLengthValidation
			fullWidth
			autoComplete="off"
			label=""
			margin="normal"
			type="text"
			minRows={3}
			minLength={UsernameMinLength}
			maxLength={UsernameMaxLength}
			helperText={errorMsg}
			error={!!errorMsg}
			value={value}
			onChange={e => {
				setErrorMsg('');
				setValue(e.target.value);
			}}
			sx={{
				fontWeight: 'bold',
				fontSize: 50,
			}}
		/>
	);
}

interface ShortBioFieldProps {
	value: string
}

export
function ShortBioField(props: ShortBioFieldProps) {
	const pushToastMsg = usePushToastMsg();
	const [persistedValue, setPersistedValue] = useState(props.value);
	const [edit, setEdit] = useState(true);
	const [value, setValue] = useState(persistedValue);

	useDebouncedCallback(value, 750, async () => {
		if(value === persistedValue) {
			return;
		}

		await updateProfile({ shortBio: value });

		pushToastMsg({
			message: 'Summary Updated',
			delay: 1500,
		});
		setPersistedValue(value);
	});

	return (
		<>
			<Tabs
				value={edit ? 'edit' : 'preview'}
				onChange={(e, newValue) => setEdit(newValue === 'edit')}
			>
				<Tab
					label="Bio summary"
					value="edit"
					onClick={() => setEdit(true)}
				/>
				<Tab
					label="Preview"
					value="preview"
					onClick={() => setEdit(false)}
				/>
			</Tabs>
			{edit && (
				<TextFieldLengthValidation
					fullWidth
					multiline
					autoComplete="off"
					label=""
					margin="normal"
					type="text"
					minRows={3}
					maxLength={MaxUserProfileShortBioLength}
					value={value}
					onChange={e => setValue(e.target.value)}
				/>
			)}
			{!edit && (
				<MarkdownContent>
					{value}
				</MarkdownContent>
			)}
		</>
	);
}

interface DetailedBioFieldProps {
	value: string
}

export
function DetailedBioField(props: DetailedBioFieldProps) {
	const pushToastMsg = usePushToastMsg();
	const [persistedValue, setPersistedValue] = useState(props.value);
	const [edit, setEdit] = useState(true);
	const [value, setValue] = useState(persistedValue);

	useDebouncedCallback(value, 750, async () => {
		if(value === persistedValue) {
			return;
		}

		await updateProfile({ detailedBio: value });

		pushToastMsg({
			message: 'Detailed Bio Updated',
			delay: 1500,
		});
		setPersistedValue(value);
	});

	return (
		<>
			<Tabs
				value={edit ? 'edit' : 'preview'}
				onChange={(e, newValue) => setEdit(newValue === 'edit')}
			>
				<Tab
					label="Full Bio"
					value="edit"
					onClick={() => setEdit(true)}
				/>
				<Tab
					label="Preview"
					value="preview"
					onClick={() => setEdit(false)}
				/>
			</Tabs>
			{edit && (
				<TextFieldLengthValidation
					fullWidth
					multiline
					label=""
					autoComplete="off"
					variant="standard"
					margin="normal"
					type="text"
					minRows={6}
					maxRows={20}
					maxLength={MaxUserProfileBioLength}
					value={value}
					onChange={e => setValue(e.target.value)}
				/>
			)}
			{!edit && (
				<MarkdownContent>
					{value}
				</MarkdownContent>
			)}
		</>
	);
}
