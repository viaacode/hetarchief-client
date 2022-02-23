import clsx from 'clsx';
import { FC } from 'react';

import { Icon } from '../../Icon';
import { dropdownIndicatorCxState } from '../../TagsInput';

import styles from './SearchBarButton.module.scss';
import { SearchBarButtonProps } from './SearchBarButton.types';

const SearchBarButton: FC<SearchBarButtonProps> = ({ className, cx, innerProps, selectProps }) => {
	return (
		<span
			{...innerProps}
			className={clsx(dropdownIndicatorCxState, className, styles['c-search-bar-button'])}
			tabIndex={0}
			/* eslint-disable @typescript-eslint/ban-ts-comment */
			// @ts-ignore
			onClick={selectProps.onSearch}
			onKeyDown={(e) => {
				if (e.key === 'Enter') {
					// @ts-ignore
					selectProps.onSearch?.();
				}
			}}
			/* eslint-enable @typescript-eslint/ban-ts-comment */
			onMouseDown={(e) => {
				// Prevent react-select default behaviour when clicking on dropdown indicator
				e.stopPropagation();
				e.preventDefault();
			}}
		>
			<Icon className={cx({ 'indicator-icon': true })} name="search" />
		</span>
	);
};

export default SearchBarButton;
