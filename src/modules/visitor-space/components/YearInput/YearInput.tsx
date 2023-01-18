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
		<TextInput
			style={{ textAlign: 'right' }}
			iconStart={<Icon name="calendar" />}
			placeholder="jjjj"
			type="number"
			{...props}
		/>
	</div>
);

export default YearInput;
