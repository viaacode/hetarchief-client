import { FC } from 'react';

import useTranslation from '@shared/hooks/use-translation/use-translation';

import { DateInput } from '../DateInput';

import styles from './DateRangeInput.module.scss';

export interface DateRangeInputProps {
	showLabels?: boolean;
	from: Date | undefined;
	to: Date | undefined;
	onChange: (from: Date | undefined, to: Date | undefined) => void;
	disabled?: boolean;
	id?: string;
}

const DateRangeInput: FC<DateRangeInputProps> = ({
	from,
	to,
	onChange,
	showLabels,
	disabled = false,
	id = undefined,
}) => {
	const { tText } = useTranslation();

	return (
		<div className={styles['c-date-range-input']} id={id}>
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
				id={id + '__from'}
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
				id={id + '__to'}
			/>
		</div>
	);
};

export default DateRangeInput;
