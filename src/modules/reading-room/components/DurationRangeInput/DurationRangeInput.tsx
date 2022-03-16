import { TextInputProps } from '@meemoo/react-components';
import { ChangeEvent, FC } from 'react';

import { DurationInput } from '../DurationInput';

import styles from './DurationRangeInput.module.scss';

const DurationRangeInput: FC<TextInputProps> = (props) => {
	const separator = '|';
	const from = (props.value || '').toString().split(separator, 2)[0];
	const to = (props.value || '').toString().split(separator, 2)[1];

	const onChange = (e: ChangeEvent<HTMLInputElement>, type: 'from' | 'to') => {
		let value = `${from}${separator}${to}`;

		switch (type) {
			case 'from':
				value = `${e.target.value}${separator}${to}`;
				break;

			case 'to':
				value = `${from}${separator}${e.target.value}`;
				break;

			default:
				break;
		}

		props.onChange?.({
			...e,
			target: {
				...e.target,
				value,
			},
		});
	};

	return (
		<div className={styles['c-duration-range-input']}>
			<DurationInput {...props} value={from} onChange={(e) => onChange(e, 'from')} />
			<DurationInput {...props} value={to} onChange={(e) => onChange(e, 'to')} />
		</div>
	);
};

export default DurationRangeInput;
