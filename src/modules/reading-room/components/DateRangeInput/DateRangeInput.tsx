import { TextInputProps } from '@meemoo/react-components';
import { ChangeEvent, FC, SyntheticEvent } from 'react';

import { DateInput } from '../DateInput';

import styles from './DateRangeInput.module.scss';

const DateRangeInput: FC<TextInputProps> = (props) => {
	const separator = '|';
	const from = (props.value || '').toString().split(separator, 2)[0];
	const to = (props.value || '').toString().split(separator, 2)[1];

	const onChange = (date: Date | null, e: SyntheticEvent | undefined, type: 'from' | 'to') => {
		let value = `${from}${separator}${to}`;

		switch (type) {
			case 'from':
				value = `${date?.toISOString()}${separator}${to}`;
				break;

			case 'to':
				value = `${from}${separator}${date?.toISOString()}`;
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
