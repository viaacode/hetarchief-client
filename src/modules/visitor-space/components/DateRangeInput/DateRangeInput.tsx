import clsx from 'clsx';
import type { FC } from 'react';

import { tText } from '@shared/helpers/translate';

import { DateInput } from '../DateInput';

import styles from './DateRangeInput.module.scss';

export interface DateRangeInputProps {
	showLabels?: boolean;
	from: Date | undefined;
	to: Date | undefined;
	onChange: (from: Date | undefined, to: Date | undefined) => void;
	disabled?: boolean;
	id?: string;
	className?: string;
}

const DateRangeInput: FC<DateRangeInputProps> = ({
	from,
	to,
	onChange,
	showLabels,
	disabled = false,
	id = undefined,
	className,
}) => {
	return (
		<div className={clsx(className, styles['c-date-range-input'])} id={id}>
			<DateInput
				label={
					showLabels
						? tText(
								'modules/visitor-space/components/advanced-filter-fields/advanced-filter-fields___van'
							)
						: ''
				}
				value={from}
				onChange={(newDate) => newDate && onChange(newDate, to)}
				disabled={disabled}
				id={`${id}__from`}
			/>
			<DateInput
				label={
					showLabels
						? tText(
								'modules/visitor-space/components/advanced-filter-fields/advanced-filter-fields___tot'
							)
						: ''
				}
				value={to}
				onChange={(newDate) => newDate && onChange(from, newDate)}
				disabled={disabled}
				id={`${id}__to`}
			/>
		</div>
	);
};

export default DateRangeInput;
