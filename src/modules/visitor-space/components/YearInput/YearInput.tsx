import { TextInput, type TextInputProps } from '@meemoo/react-components';
import type { FC } from 'react';

import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';

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
	const { isYearInputRange, ...propsWithoutIsYearInputRange } = props;
	return (
		<div className={styles['c-year-input']}>
			<div className={styles['c-year-input__label']}>
				<b>{props.label}</b>
			</div>
			<TextInput
				iconStart={<Icon name={IconNamesLight.Calendar} />}
				type="text"
				{...propsWithoutIsYearInputRange}
			/>
			<span className={classname}>jjjj</span>
		</div>
	);
};

export default YearInput;
