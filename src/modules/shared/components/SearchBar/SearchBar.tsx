import { Button, TagsInput } from '@meemoo/react-components';
import { FC } from 'react';

import { SearchBarProps } from './SearchBar.types';

import { Icon } from '@shared/components';

// Wrap TagsInput with default props and custom search button
const SearchBar: FC<SearchBarProps> = ({
	clearLabel,
	menuIsOpen,
	options,
	onClear,
	onSearchClick,
	...tagsInputProps
}) => {
	const hasSearchClick = typeof onSearchClick === 'function';
	const hasOnClear = typeof onSearchClick === 'function';
	const hasCustomClear = clearLabel || hasOnClear;

	const renderClearButton = () => {
		return <div />;
	};

	const renderSearchButton = () => {
		return (
			<div
				onMouseDown={(e) => {
					// Prevent react-select default behaviour when clicking on dropdown indicator
					e.stopPropagation();
					e.preventDefault();
				}}
			>
				<Button icon={<Icon name="search" />} onClick={onSearchClick} />
			</div>
		);
	};

	return (
		<TagsInput
			{...tagsInputProps}
			components={{
				...tagsInputProps.components,
				...(hasCustomClear && { ClearIndicator: renderClearButton }),
				...(hasSearchClick && { DropdownIndicator: renderSearchButton }),
				IndicatorSeparator: () => null,
			}}
			menuIsOpen={typeof menuIsOpen !== undefined ? menuIsOpen : (options?.length ?? 0) > 0}
			options={options}
		/>
	);
};

export default SearchBar;
