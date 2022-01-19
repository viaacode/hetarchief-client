import { TagsInput, TagsInputProps } from '@meemoo/react-components';
import clsx from 'clsx';
import { KeyboardEvent, ReactElement } from 'react';

import { TAGS_INPUT_COMPONENTS } from '../TagsInput';

import { SearchBarMeta, SearchBarProps, SearchBarValue } from './SearchBar.types';
import { SearchBarButton } from './SearchBarButton';
import { SearchBarClear } from './SearchBarClear';
import { SearchBarValueContainer } from './SearchBarValueContainer';

const components = {
	...TAGS_INPUT_COMPONENTS,
	ClearIndicator: SearchBarClear,
	DropdownIndicator: SearchBarButton,
	ValueContainer: SearchBarValueContainer,
};

// Wrap TagsInput with default props and custom search button
const SearchBar = <IsMulti extends boolean>({
	className,
	clearLabel,
	isClearable = true,
	isMulti = false as IsMulti,
	large,
	menuIsOpen,
	options,
	valuePlaceholder,
	onClear,
	onChange,
	onSearch,
	...tagsInputProps
}: SearchBarProps<IsMulti>): ReactElement => {
	const rootCls = clsx(className, 'c-search-bar', {
		['c-search-bar--large']: large,
	});
	const showMenu = typeof menuIsOpen !== 'undefined' ? menuIsOpen : (options?.length ?? 0) > 0;

	const onTagsInputChange = (
		newValue: SearchBarValue<IsMulti>,
		actionMeta: SearchBarMeta
	): void => {
		if (actionMeta.action === 'clear') {
			onClear?.();
		}
		onChange?.(newValue, actionMeta);
	};

	const onTagsInputKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
		if (e.key === 'Enter') {
			onSearch?.();
			return;
		}

		tagsInputProps.onKeyDown?.(e);
	};

	return (
		<TagsInput
			{...tagsInputProps}
			className={rootCls}
			components={components as TagsInputProps<boolean>['components']}
			isClearable={isClearable}
			isMulti={isMulti}
			menuIsOpen={showMenu}
			options={options}
			// ts-igonore is necessary to provide custom props to react-select, this is explained
			// in the react-select docs: https://react-select.com/components#defining-components
			/* eslint-disable @typescript-eslint/ban-ts-comment */
			// @ts-ignore
			clearLabel={clearLabel}
			// @ts-ignore
			valuePlaceholder={valuePlaceholder}
			// @ts-ignore
			onSearch={onSearch}
			/* eslint-enable @typescript-eslint/ban-ts-comment */
			onChange={onTagsInputChange}
			onKeyDown={onTagsInputKeyDown}
		/>
	);
};

export default SearchBar;
