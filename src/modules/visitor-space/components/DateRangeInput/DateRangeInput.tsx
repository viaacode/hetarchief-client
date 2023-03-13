import { TextInputProps } from '@meemoo/react-components';
import { endOfDay, startOfDay } from 'date-fns';
import { ChangeEvent, FC, SyntheticEvent } from 'react';

import { SEPARATOR } from '@shared/const';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { asDate } from '@shared/utils';

import { DateInput } from '../DateInput';

import styles from './DateRangeInput.module.scss';

interface DateRangeInputProps extends TextInputProps {
	showLabels?: boolean;
}

const DateRangeInput: FC<Omit<DateRangeInputProps, 'onSelect'>> = (props) => {
	const { tText } = useTranslation();
	const split = (props.value || '').toString().split(SEPARATOR, 2);

	const from: string | undefined = split[0];
	const to: string | undefined = split[1];

	const onChange = (date: Date | null, e: SyntheticEvent | undefined, type: 'from' | 'to') => {
		let value = `${from}${SEPARATOR}${to}`;
		let parsed: string | number = '';

		switch (type) {
			case 'from':
				parsed = asDate(date) ? startOfDay(asDate(date) || 0).valueOf() : '';
				value = date ? `${parsed}${SEPARATOR}${to}` : to;
				break;

			case 'to':
				parsed = asDate(date) ? endOfDay(asDate(date) || 0).valueOf() : '';
				value = date ? `${from}${SEPARATOR}${parsed}` : from;
				break;

			default:
				break;
		}

		if (e) {
			const clone = {
				...e,
				target: {
					...e.target,
					value,
				},
			} as ChangeEvent<HTMLInputElement>;

			props.onChange?.(clone);
		}
	};

	return (
		<div className={styles['c-date-range-input']}>
			<DateInput
				{...props}
				label={
					props.showLabels
						? tText(
								'modules/visitor-space/components/advanced-filter-fields/advanced-filter-fields___van'
						  )
						: ''
				}
				value={from}
				onChange={(date, e) => onChange(date, e, 'from')}
			/>
			<DateInput
				{...props}
				label={
					props.showLabels
						? tText(
								'modules/visitor-space/components/advanced-filter-fields/advanced-filter-fields___tot'
						  )
						: ''
				}
				value={to}
				onChange={(date, e) => onChange(date, e, 'to')}
			/>
		</div>
	);
};

export default DateRangeInput;
