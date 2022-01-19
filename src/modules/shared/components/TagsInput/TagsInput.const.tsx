import { Tag, TagsInputProps } from '@meemoo/react-components';
import { MouseEvent } from 'react';

import { Icon } from '../Icon';

export const clearIndicatorCxState = {
	indicator: true,
	'clear-indicator': true,
};

export const dropdownIndicatorCxState = {
	indicator: true,
	'dropdown-indicator': true,
};

export const multiValueCxState = {
	'multi-value': true,
};

export const TAGS_INPUT_COMPONENTS: TagsInputProps<boolean>['components'] = {
	ClearIndicator: ({ className, cx, innerProps }) => {
		return (
			<span {...innerProps} className={cx(clearIndicatorCxState, className)} tabIndex={1}>
				<Icon className={cx({ 'indicator-icon': true })} name="times" />
			</span>
		);
	},
	DropdownIndicator: ({ className, cx, innerProps }) => {
		return (
			<span
				{...innerProps}
				onMouseDown={(e) => {
					e.stopPropagation();
					e.preventDefault();
				}}
				className={cx(dropdownIndicatorCxState, className)}
				tabIndex={1}
			>
				<Icon className={cx({ 'indicator-icon': true })} name="angle-down" />
			</span>
		);
	},
	IndicatorSeparator: () => null,
	MultiValue: ({ children, className, cx, data, innerProps, isDisabled, removeProps }) => {
		return (
			<span {...innerProps} className={cx(multiValueCxState, className)}>
				<Tag
					id={data.value}
					label={children}
					closeIcon={<Icon name="times" />}
					disabled={isDisabled}
					variants="closable"
					onClose={(id, e) => {
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						removeProps.onClick?.(e as MouseEvent<any>);
					}}
				/>
			</span>
		);
	},
};
