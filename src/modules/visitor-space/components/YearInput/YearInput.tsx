import { TextInput, type TextInputProps } from '@meemoo/react-components';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import type { FC } from 'react';

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
	// biome-ignore lint/correctness/noUnusedVariables: No need for the variable to pass on
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
