import clsx from 'clsx';
import { FC } from 'react';

import { Icon, IconNamesLight } from '../../Icon';
import { dropdownIndicatorCxState } from '../../TagsInput';

import { TagSearchBarClearProps } from './TagSearchBarClear.types';

const TagSearchBarClear: FC<TagSearchBarClearProps> = ({
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
					<span className="c-tag-search-bar__clear-label u-display-none u-display-inline-block:lg">
						{clearLabel}
					</span>
					<Icon
						className={clsx('u-display-none:lg', cx({ 'indicator-icon': true }))}
						name={IconNamesLight.Times}
					/>
				</>
			) : (
				<Icon className={cx({ 'indicator-icon': true })} name={IconNamesLight.Times} />
			)}
		</span>
	);
};

export default TagSearchBarClear;
