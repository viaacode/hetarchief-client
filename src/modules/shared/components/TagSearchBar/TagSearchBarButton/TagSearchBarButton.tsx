import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { dropdownIndicatorCxState } from '@shared/components/TagsInput';
import clsx from 'clsx';
import type { FC } from 'react';

import styles from './TagSearchBarButton.module.scss';
import type { TagSearchBarButtonProps } from './TagSearchBarButton.types';

const TagSearchBarButton: FC<TagSearchBarButtonProps> = ({
	className,
	cx,
	innerProps,
	selectProps,
}) => {
	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: _
		<span
			{...innerProps}
			className={clsx(dropdownIndicatorCxState, className, styles['c-tag-search-bar-button'])}
			/* eslint-disable @typescript-eslint/ban-ts-comment */
			// @ts-expect-error
			onClick={selectProps.onSearch}
			// biome-ignore lint/suspicious/noExplicitAny: No typing yet
			onTouchEnd={() => (selectProps as any).onSearch?.()} // Make search button clickable on touch devices
			onKeyDown={(e) => {
				if (e.key === 'Enter') {
					// @ts-expect-error
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
			<Icon className={cx({ 'indicator-icon': true })} name={IconNamesLight.Search} />
		</span>
	);
};

export default TagSearchBarButton;
