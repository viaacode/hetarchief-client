import clsx from 'clsx';
import { FC } from 'react';

import { Icon } from '../../Icon';
import { dropdownIndicatorCxState } from '../../TagsInput';

import { SearchBarClearProps } from './SearchBarClear.types';

const SearchBarClear: FC<SearchBarClearProps> = ({
	className,
	cx,
	innerProps,
	selectProps,
	clearValue,
}) => {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const { clearLabel } = selectProps;

	return (
		<span
			{...innerProps}
			onKeyDown={(e) => {
				if (e.key === 'Enter') {
					clearValue();
				}
				e.stopPropagation();
			}}
			className={cx(dropdownIndicatorCxState, className)}
			tabIndex={0}
		>
			{clearLabel ? (
				<>
					<span className="c-search-bar__clear-label u-display-none u-display-inline-block:lg">
						{clearLabel}
					</span>
					<Icon
						className={clsx('u-display-none:lg', cx({ 'indicator-icon': true }))}
						name="times"
					/>
				</>
			) : (
				<Icon className={cx({ 'indicator-icon': true })} name="times" />
			)}
		</span>
	);
};

export default SearchBarClear;
