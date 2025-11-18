import type {
	OnSearchSingle,
	TagSearchBarMeta,
	TagSearchBarProps,
	TagSearchBarValue,
} from '@shared/components/TagSearchBar/TagSearchBar.types';
import { TagSearchBarButton } from '@shared/components/TagSearchBar/TagSearchBarButton';
import { tText } from '@shared/helpers/translate';
import clsx from 'clsx';
import { type KeyboardEvent, type ReactElement, useMemo } from 'react';
import type { InputActionMeta } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { Spinner } from '../Spinner/Spinner';
import { TAGS_INPUT_COMPONENTS } from '../TagsInput';
import { TagSearchBarClear } from './TagSearchBarClear';
import { TagSearchBarValueContainer } from './TagSearchBarValueContainer';

// Wrap TagsInput with default props and custom search button
const TagSearchBar = <IsMulti extends boolean>({
	className,
	clearLabel,
	inputValue,
	setInputValue,
	isClearable = true,
	isMulti = false as IsMulti,
	light = false,
	hasDropdown = false,
	renderedRight,
	menuIsOpen,
	isLoading,
	onChange,
	onClear,
	onCreate,
	onRemoveValue,
	onSearch,
	options,
	size = undefined,
	valuePlaceholder,
	...tagsInputProps
}: Partial<TagSearchBarProps<IsMulti>> & {
	setInputValue: (newInputValue: string) => void;
	isLoading: boolean;
}): ReactElement => {
	const selectValue = useMemo(
		() => (inputValue ? { label: inputValue, value: inputValue } : null),
		[inputValue]
	);

	/**
	 * Methods
	 */

	const onSearchChange = (
		newValue: TagSearchBarValue<IsMulti>,
		actionMeta: TagSearchBarMeta
	): void => {
		if (['pop-value', 'remove-value'].includes(actionMeta.action)) {
			onRemoveValue?.(newValue);
		}
		if (actionMeta.action === 'clear') {
			onClear?.();
			setInputValue('');
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
			if (!inputValue) {
				return;
			}

			onCreate?.(inputValue);
			setInputValue('');
			e.preventDefault();

			onSafeSearchSingle();
		}
	};

	/**
	 * Computed
	 */

	const rootCls = clsx(className, 'c-tag-search-bar', 'c-tags-input', 'c-tags-input__creatable', {
		[`c-tag-search-bar--${size}`]: size,
		'c-tag-search-bar--has-value-placeholder': !!valuePlaceholder,
		'c-tag-search-bar--light': light,
		'c-tag-search-bar--has-dropdown': hasDropdown,
		'c-tag-search-bar--has-rendered-right': renderedRight,
	});
	const showMenu = typeof menuIsOpen !== 'undefined' ? menuIsOpen : (options?.length ?? 0) > 0;
	const value = isMulti ? tagsInputProps.value : selectValue;

	/**
	 * Render
	 */

	const components = {
		...TAGS_INPUT_COMPONENTS,
		ClearIndicator: TagSearchBarClear,
		DropdownIndicator: isLoading ? Spinner : TagSearchBarButton,
		ValueContainer: TagSearchBarValueContainer,
	};
	return (
		<div className="u-flex u-align-center u-justify-between">
			<CreatableSelect
				aria-label={tText(
					'modules/shared/components/tag-search-bar/tag-search-bar___zoekbalk-aria-label'
				)}
				classNamePrefix={'c-tags-input'}
				{...tagsInputProps}
				className={rootCls}
				// biome-ignore lint/suspicious/noExplicitAny: No typing yet
				components={components as any}
				inputValue={inputValue}
				isClearable={isClearable}
				isMulti={isMulti}
				menuIsOpen={showMenu}
				onCreateOption={onCreate}
				onInputChange={onSearchInputChange}
				onKeyDown={onSearchKeyDown}
				options={options}
				value={value}
				// ts-ignore is necessary to provide custom props to react-select, this is explained
				// in the react-select docs: https://react-select.com/components#defining-components
				clearLabel={clearLabel}
				valuePlaceholder={valuePlaceholder}
				onSearch={onSafeSearchSingle}
				// @ts-expect-error
				onChange={onSearchChange}
				/* eslint-enable @typescript-eslint/ban-ts-comment */
			/>
			{renderedRight || null}
		</div>
	);
};

export default TagSearchBar;
