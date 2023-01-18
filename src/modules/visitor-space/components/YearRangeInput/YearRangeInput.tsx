import { TextInputProps } from '@meemoo/react-components';
import { endOfDay } from 'date-fns';
import { ChangeEvent, FC, useState } from 'react';

import { SEPARATOR } from '@shared/const';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { asDate } from '@shared/utils';

import { YearInput } from '../YearInput';

import styles from './YearRangeInput.module.scss';

interface YearRangeInputProps extends TextInputProps {
	showLabels?: boolean;
}

const YearRangeInput: FC<Omit<YearRangeInputProps, 'onSelect'>> = (props) => {
	const { tText } = useTranslation();
	const split = (props.value || '').toString().split(SEPARATOR, 2);

	const from: string | undefined = split[0];
	const to: string | undefined = split[1];

	const [yearFrom, setYearFrom] = useState(from);
	const [yearTo, setYearTo] = useState(to);

	const onChange = (e: ChangeEvent<HTMLInputElement>, type: 'from' | 'to') => {
		let value = `${from}${SEPARATOR}${to}`;
		const yearString = e.target.value;
		let startOfYear = asDate(`01/01/${yearFrom}`)?.valueOf();
		let endOfYear = endOfDay(asDate(`12/31/${yearTo}`) || 0).valueOf();

		console.log(type);

		switch (type) {
			case 'from':
				setYearFrom(yearString);
				startOfYear = asDate(`01/01/${yearString}`)?.valueOf() || 0;
				value = `${startOfYear}${SEPARATOR}${endOfYear}`;
				break;

			case 'to':
				setYearTo(yearString);
				endOfYear = endOfDay(asDate(`12/31/${yearString}`) || 0).valueOf();
				value = `${startOfYear}${SEPARATOR}${endOfYear}`;
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
				label={
					props.showLabels
						? tText(
								'modules/visitor-space/components/advanced-filter-fields/advanced-filter-fields___van'
						  )
						: ''
				}
				value={yearFrom}
				onChange={(e) => {
					if (e.target.value.length < 5) {
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
					if (e.target.value.length < 5) {
						onChange(e, 'to');
					}
				}}
			/>
		</div>
	);
};

export default YearRangeInput;
