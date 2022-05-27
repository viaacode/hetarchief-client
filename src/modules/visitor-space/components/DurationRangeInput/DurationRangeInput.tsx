import { TextInputProps } from '@meemoo/react-components';
import { ChangeEvent, FC } from 'react';

import { SEPARATOR } from '@shared/const';

import { DurationInput } from '../DurationInput';

import styles from './DurationRangeInput.module.scss';

const DurationRangeInput: FC<TextInputProps> = (props) => {
	const from = (props.value || '').toString().split(SEPARATOR, 2)[0] || '';
	const to = (props.value || '').toString().split(SEPARATOR, 2)[1] || '';

	const onChange = (e: ChangeEvent<HTMLInputElement>, type: 'from' | 'to') => {
		let value = `${from}${SEPARATOR}${to}`;

		switch (type) {
			case 'from':
				value = `${e.target.value}${SEPARATOR}${to}`;
				break;

			case 'to':
				value = `${from}${SEPARATOR}${e.target.value}`;
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
