import clsx from 'clsx';
import { FC } from 'react';

import { Icon } from '../../Icon';
import { dropdownIndicatorCxState } from '../../TagsInput';

import styles from './TagSearchBarButton.module.scss';
import { TagSearchBarButtonProps } from './TagSearchBarButton.types';

const TagSearchBarButton: FC<TagSearchBarButtonProps> = ({
	className,
	cx,
	innerProps,
	selectProps,
}) => {
	return (
		<span
			{...innerProps}
			className={clsx(dropdownIndicatorCxState, className, styles['c-tag-search-bar-button'])}
			tabIndex={0}
			/* eslint-disable @typescript-eslint/ban-ts-comment */
			// @ts-ignore
			onClick={selectProps.onSearch}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			onTouchEnd={() => (selectProps as any).onSearch?.()} // Make search button clickable on touch devices
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

export default TagSearchBarButton;
