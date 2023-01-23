import { TextInput, TextInputProps } from '@meemoo/react-components';
import { FC } from 'react';

import { Icon } from '@shared/components';

import styles from './YearInput.module.scss';

interface YearInputProps extends TextInputProps {
	label?: string;
}

const YearInput: FC<YearInputProps> = (props) => (
	<div className={styles['c-year-input']}>
		<div className={styles['c-year-input__label']}>
			<b>{props.label}</b>
		</div>
		<TextInput iconStart={<Icon name="calendar" />} type="text" {...props} />
		<span
			className={
				props.value
					? styles['c-year-input__placeholder-hidden']
					: styles['c-year-input__placeholder']
			}
		>
			jjjj
		</span>
	</div>
);

export default YearInput;
