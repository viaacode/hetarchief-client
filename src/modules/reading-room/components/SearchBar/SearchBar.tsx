import { TextInput } from '@meemoo/react-components';
import { ChangeEvent, FC, useState } from 'react';

import { Icon } from '@shared/components';

import { SearchBarProps } from './SearchBar.types';

const SearchBar: FC<SearchBarProps> = ({ onChange, onKeyUp }) => {
	const [searchValue, setSearchValue] = useState('');

	const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
		setSearchValue(e.target.value);

		if (typeof onChange === 'function') {
			onChange(e);
		}
	};

	// TODO: replace with TagsInput component
	return (
		<TextInput
			className="u-mb-24"
			iconEnd={<Icon name="search" />}
			placeholder="Zoek op trefwoord, jaartal, aanbieder..."
			value={searchValue}
			variants={['lg', 'rounded']}
			onChange={onSearchChange}
			onKeyUp={onKeyUp}
		/>
	);
};

export default SearchBar;
