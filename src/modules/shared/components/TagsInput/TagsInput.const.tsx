import { Tag, TagsInputProps } from '@meemoo/react-components';
import { MouseEvent } from 'react';

import { Icon } from '../Icon';

const clearIndicatorCxState = {
	indicator: true,
	'clear-indicator': true,
};

const dropdownIndicatorCxState = {
	indicator: true,
	'dropdown-indicator': true,
};

export const TAGS_INPUT_DEFAULT_PROPS: TagsInputProps<boolean> = {
	components: {
		ClearIndicator: ({ className, cx, innerProps }) => {
			return (
				<span {...innerProps} className={cx(clearIndicatorCxState, className)}>
					<Icon name="times" />
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
				>
					<Icon name="search" />
				</span>
			);
		},
		IndicatorSeparator: () => null,
		MultiValue: (props) => {
			console.log(props);
			return (
				<span {...props.innerProps}>
					<Tag
						id={props.data.value}
						label={props.children}
						closeIcon={<Icon name="times" />}
						disabled={props.isDisabled}
						onClose={(id, e) => {
							// eslint-disable-next-line @typescript-eslint/no-explicit-any
							props.removeProps.onClick?.(e as MouseEvent<any>);
						}}
					/>
				</span>
			);
		},
	},
};
