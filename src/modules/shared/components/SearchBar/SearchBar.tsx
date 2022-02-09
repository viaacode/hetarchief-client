import { TagsInput, TagsInputProps } from '@meemoo/react-components';
import clsx from 'clsx';
import { KeyboardEvent, ReactElement, useEffect, useMemo, useState } from 'react';
import { InputActionMeta } from 'react-select';

import { TAGS_INPUT_COMPONENTS } from '../TagsInput';

import { OnSearchSingle, SearchBarMeta, SearchBarProps, SearchBarValue } from './SearchBar.types';
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
	light = false,
	menuIsOpen,
	options,
	searchValue,
	size = undefined,
	syncSearchValue = true,
	valuePlaceholder,
	onChange,
	onClear,
	onCreate,
	onRemoveValue,
	onSearch,
	...tagsInputProps
}: SearchBarProps<IsMulti>): ReactElement => {
	const [inputValue, setInputValue] = useState(searchValue);
	const selectValue = useMemo(
		() => (inputValue ? { label: inputValue, value: inputValue } : null),
		[inputValue]
	);

	useEffect(() => {
		if (syncSearchValue) {
			setInputValue(searchValue);
		}
	}, [searchValue, syncSearchValue]);

	/**
	 * Methods
	 */

	const onSearchChange = (newValue: SearchBarValue<IsMulti>, actionMeta: SearchBarMeta): void => {
		if (['pop-value', 'remove-value'].includes(actionMeta.action)) {
			onRemoveValue?.(newValue);
		}
		if (actionMeta.action === 'clear') {
			onClear?.();
		}
		onChange?.(newValue, actionMeta);
	};

	const onSearchInputChange = (newValue: string, actionMeta: InputActionMeta): void => {
		if (actionMeta.action === 'input-change') {
			setInputValue(newValue);
		}
	};

	const onSafeSearchSingle = () => {
		if (onSearch) {
			(onSearch as OnSearchSingle)(inputValue ?? '');
			setInputValue('');
		}
	};

	const onSearchKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
		if (e.key === 'Enter') {
			if (tagsInputProps.allowCreate) {
				if (!inputValue) {
					return;
				}

				onCreate?.(inputValue);
				setInputValue('');
				e.preventDefault();
			}

			onSafeSearchSingle();
		}

		if (!tagsInputProps.allowCreate) {
			tagsInputProps.onKeyDown?.(e);
		}
	};

	/**
	 * Computed
	 */

	const rootCls = clsx(className, 'c-search-bar', {
		[`c-search-bar--${size}`]: size,
		['c-search-bar--has-value-placeholder']: !!valuePlaceholder,
		['c-search-bar--light']: light,
	});
	const showMenu = typeof menuIsOpen !== 'undefined' ? menuIsOpen : (options?.length ?? 0) > 0;
	const value = isMulti ? tagsInputProps.value : selectValue;

	/**
	 * Render
	 */

	return (
		<TagsInput
			{...tagsInputProps}
			className={rootCls}
			components={components as TagsInputProps<boolean>['components']}
			inputValue={inputValue}
			isClearable={isClearable}
			isMulti={isMulti}
			menuIsOpen={showMenu}
			onChange={onSearchChange}
			onCreateOption={onCreate}
			onInputChange={onSearchInputChange}
			onKeyDown={onSearchKeyDown}
			options={options}
			value={value}
			// ts-igonore is necessary to provide custom props to react-select, this is explained
			// in the react-select docs: https://react-select.com/components#defining-components
			/* eslint-disable @typescript-eslint/ban-ts-comment */
			// @ts-ignore
			clearLabel={clearLabel}
			// @ts-ignore
			valuePlaceholder={valuePlaceholder}
			// @ts-ignore
			onSearch={onSafeSearchSingle}
			/* eslint-enable @typescript-eslint/ban-ts-comment */
		/>
	);
};

export default SearchBar;
