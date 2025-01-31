import type { TextInputProps } from '@meemoo/react-components';
import { endOfDay } from 'date-fns';
import { type ChangeEvent, type FC, useState } from 'react';

import { SEPARATOR } from '@shared/const';
import { YEAR_LENGTH } from '@shared/const/date';
import { tText } from '@shared/helpers/translate';
import { asDate } from '@shared/utils/dates';

import { YearInput } from '../YearInput';

import styles from './YearRangeInput.module.scss';

interface YearRangeInputProps extends TextInputProps {
	showLabels?: boolean;
}

const YearRangeInput: FC<Omit<YearRangeInputProps, 'onSelect'>> = (props) => {
	const split = (props.value || '').toString().split(SEPARATOR, 2);

	const from: string | undefined = split[0];
	const to: string | undefined = split[1];

	const [yearFrom, setYearFrom] = useState(from);
	const [yearTo, setYearTo] = useState(to);

	const onChange = (e: ChangeEvent<HTMLInputElement>, type: 'from' | 'to') => {
		let value = `${from}${SEPARATOR}${to}`;
		const yearString = e.target.value;
		const isNumberReg = new RegExp(/^\d+$/);
		const isNumber = isNumberReg.test(yearString) || yearString === '';

		const newYearFrom = type === 'from' ? yearString : yearFrom;
		const newYearTo = type === 'to' ? yearString : yearFrom;

		const startOfYear = newYearFrom ? asDate(`01/01/${newYearFrom}`)?.toISOString() : undefined;
		const endOfYear = newYearTo
			? endOfDay(asDate(`12/31/${newYearTo}`) as Date).toISOString()
			: undefined;

		switch (type) {
			case 'from':
				if (isNumber && yearString.length <= YEAR_LENGTH) {
					setYearFrom(yearString);

					value = `${startOfYear}${SEPARATOR}${endOfYear}`;
				}
				break;

			case 'to':
				if (isNumber && yearString.length <= YEAR_LENGTH) {
					setYearTo(yearString);
					value = `${startOfYear}${SEPARATOR}${endOfYear}`;
				}
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
		<div className={styles['c-year-range-input']}>
			<YearInput
				{...props}
				isYearInputRange
				label={
					props.showLabels
						? tText(
								'modules/visitor-space/components/advanced-filter-fields/advanced-filter-fields___van'
							)
						: ''
				}
				value={yearFrom}
				onChange={(e) => {
					if (e.target.value.length <= YEAR_LENGTH) {
						onChange(e, 'from');
					}
				}}
			/>
			<YearInput
				{...props}
				label={
					props.showLabels
						? tText(
								'modules/visitor-space/components/advanced-filter-fields/advanced-filter-fields___tot'
							)
						: ''
				}
				value={yearTo}
				onChange={(e) => {
					if (e.target.value.length <= YEAR_LENGTH) {
						onChange(e, 'to');
					}
				}}
			/>
		</div>
	);
};

export default YearRangeInput;
