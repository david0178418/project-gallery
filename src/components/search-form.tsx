'use client';

import { AppName, Paths } from '@common/constants';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Key } from 'ts-key-enum';
import TextField from './common/text-field';

interface Props {
	placeholder?: string;
	value?: string;
	searchPath?: string;
}

export
// TODO Simplify this to an actual form submission
function SearchForm(props: Props) {
	const {
		placeholder = `Search ${AppName}`,
		value: searchTerm = '',
		searchPath = Paths.Search,
	} = props;
	const [searchQueary, setSearchQuery] = useState(searchTerm);
	const { push } = useRouter();

	function handleSubmit() {
		const queryParams: any = {};

		if(searchQueary) {
			queryParams.q = searchQueary;
		}

		push(`${searchPath}?${searchQueary ? `q=${searchQueary}` : ''}`);
	}

	function handleKeyUp(key: string) {
		if(key === Key.Enter) {
			handleSubmit();
		}
	}

	return (
		<TextField
			className="w-full"
			placeholder={placeholder}
			value={searchQueary}
			onKeyUp={e => handleKeyUp(e.key)}
			onChange={e => setSearchQuery(e.target.value)}
		/>
	);
}
