import { Tag, TagsInputProps } from '@meemoo/react-components';

import { Icon, IconNamesLight } from '../Icon';

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
				<Icon className={cx({ 'indicator-icon': true })} name={IconNamesLight.Times} />
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
				<Icon className={cx({ 'indicator-icon': true })} name={IconNamesLight.AngleDown} />
			</span>
		);
	},
	IndicatorSeparator: () => null,
	MultiValue: ({ children, className, cx, data, innerProps, isDisabled, removeProps }) => {
		const renderCloseButton = () => {
			return (
				<div {...removeProps} className="c-tag__close">
					<Icon name={IconNamesLight.Times} />
				</div>
			);
		};

		return (
			<span {...innerProps} className={cx(multiValueCxState, className)}>
				<Tag
					id={data.value}
					label={children}
					closeButton={renderCloseButton()}
					disabled={isDisabled}
					variants="closable"
				/>
			</span>
		);
	},
};
