import { FC } from 'react';

import { Icon } from '../../Icon';
import { dropdownIndicatorCxState } from '../../TagsInput';

import { SearchBarClearProps } from './SearchBarClear.types';

const SearchBarClear: FC<SearchBarClearProps> = ({ className, cx, innerProps, selectProps }) => {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const { clearLabel } = selectProps;

	return (
		<span {...innerProps} className={cx(dropdownIndicatorCxState, className)} tabIndex={0}>
			{clearLabel ? (
				<span className="c-search-bar__clear-label">{clearLabel}</span>
			) : (
				<Icon className={cx({ 'indicator-icon': true })} name="times" />
			)}
		</span>
	);
};

export default SearchBarClear;
