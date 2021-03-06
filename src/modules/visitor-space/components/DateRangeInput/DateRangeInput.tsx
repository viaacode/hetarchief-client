import { TextInputProps } from '@meemoo/react-components';
import { endOfDay, startOfDay } from 'date-fns';
import { ChangeEvent, FC, SyntheticEvent } from 'react';

import { SEPARATOR } from '@shared/const';
import { asDate } from '@shared/utils';

import { DateInput } from '../DateInput';

import styles from './DateRangeInput.module.scss';

const DateRangeInput: FC<TextInputProps> = (props) => {
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
			<DateInput value={from} onChange={(date, e) => onChange(date, e, 'from')} />
			<DateInput value={to} onChange={(date, e) => onChange(date, e, 'to')} />
		</div>
	);
};

export default DateRangeInput;
