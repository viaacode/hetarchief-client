import { FC } from 'react';

import { Icon } from '../../Icon';
import { dropdownIndicatorCxState } from '../../TagsInput';

import { SearchBarButtonProps } from './SearchBarButton.types';

const SearchBarButton: FC<SearchBarButtonProps> = ({ className, cx, innerProps, selectProps }) => {
	return (
		<span
			{...innerProps}
			className={cx(dropdownIndicatorCxState, className)}
			tabIndex={0}
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			onClick={selectProps.onSearch}
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
