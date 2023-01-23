import { TextInput, TextInputProps } from '@meemoo/react-components';
import { FC } from 'react';

import { Icon } from '@shared/components';

import styles from './YearInput.module.scss';

interface YearInputProps extends TextInputProps {
	label?: string;
	isYearInputRange?: boolean;
}

const YearInput: FC<YearInputProps> = (props) => {
	const classname = props.value
		? styles['c-year-input__placeholder-hidden']
		: props.isYearInputRange
		? styles['c-year-input__placeholder-wide']
		: styles['c-year-input__placeholder'];
	return (
		<div className={styles['c-year-input']}>
			<div className={styles['c-year-input__label']}>
				<b>{props.label}</b>
			</div>
			<TextInput iconStart={<Icon name="calendar" />} type="text" {...props} />
			<span className={classname}>jjjj</span>
		</div>
	);
};

export default YearInput;
