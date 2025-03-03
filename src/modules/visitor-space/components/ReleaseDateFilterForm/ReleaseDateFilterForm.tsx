import { FormControl, ReactSelect, type SelectOption } from '@meemoo/react-components';
import clsx from 'clsx';
import { endOfDay, parseISO, startOfDay } from 'date-fns';
import React, { type ChangeEvent, type FC, useEffect, useMemo, useState } from 'react';
import type { MultiValue, SingleValue } from 'react-select';
import { useQueryParam } from 'use-query-params';

import { RedFormWarning } from '@shared/components/RedFormWarning/RedFormWarning';
import { SEPARATOR } from '@shared/const';
import { YEAR_LENGTH } from '@shared/const/date';
import { convertYearToDate } from '@shared/helpers/convert-year-to-date';
import { tHtml } from '@shared/helpers/translate';

import {
	type DefaultFilterFormProps,
	type FilterValue,
	Operator,
	SearchFilterId,
	isRange,
} from '../../types';
import { getSelectValue } from '../../utils/select';
import { DateInput } from '../DateInput';
import { DateRangeInput } from '../DateRangeInput';
import { SelectDateOrYear } from '../SelectDateOrYear';
import { YearInput } from '../YearInput';
import YearRangeInput from '../YearRangeInput/YearRangeInput';
import styles from './ReleaseDateFilterForm.module.scss';

import { validateForm } from '@shared/helpers/validate-form';
import { initialFilterValue } from '@visitor-space/components/AdvancedFilterForm/AdvancedFilterForm.const';
import FilterFormButtons from '@visitor-space/components/FilterMenu/FilterFormButtons/FilterFormButtons';
import { RELEASE_DATE_FILTER_FORM_SCHEMA } from '@visitor-space/components/ReleaseDateFilterForm/ReleaseDateFilterForm.const';
import { AdvancedFilterArrayParam } from '@visitor-space/const/advanced-filter-array-param';
import { getOperators } from 'modules/visitor-space/utils/advanced-filters';

const ReleaseDateFilterForm: FC<DefaultFilterFormProps> = ({
	className,
	disabled,
	initialValue,
	onSubmit,
	onReset,
}) => {
	const [initialValueFromQueryParams] = useQueryParam(
		SearchFilterId.ReleaseDate,
		AdvancedFilterArrayParam
	);
	const [value, setValue] = useState<FilterValue>(
		initialValueFromQueryParams
			? {}
			: initialValue || initialFilterValue(Operator.GREATER_THAN_OR_EQUAL)
	);
	const [formErrors, setFormErrors] = useState<Record<string, string> | null>(null);

	const [showRange] = useState(isRange(value?.op));

	const [yearsSelected, setYearsSelected] = useState(false);
	const [year, setYear] = useState<string | undefined>(undefined);
	const [yearRange, setYearRange] = useState<string | undefined>(undefined);

	const operators = useMemo(() => getOperators(SearchFilterId.ReleaseDate), []);

	// Events

	const convertToRange = (date: Date) => {
		try {
			const parsedFrom = startOfDay(date).toISOString();
			const parsedTo = endOfDay(date).toISOString();

			const value = `${parsedFrom}${SEPARATOR}${parsedTo}`;

			setValue((oldValue) => ({ ...oldValue, releaseDate: value }));
		} catch (err) {
			// ignore invalid dates since the user can still be typing something
		}
	};

	const onChangeYear = (e: ChangeEvent<HTMLInputElement>) => {
		const isNumberReg = new RegExp(/^\d+$/);
		const isNumber = isNumberReg.test(e.target.value) || e.target.value === '';

		if (isNumber && e.target.value.length <= YEAR_LENGTH) {
			setYear(e.target.value);
		}
	};

	const onChangeDateInput = (newDate: Date | null) => {
		if (!newDate) {
			setValue((oldValue) => ({ ...oldValue, releaseDate: undefined }));
			return;
		}
		if (value.op === Operator.EQUALS) {
			convertToRange(newDate);
			return;
		}
		onChangeReleaseDate((newDate || new Date()).toISOString());
	};

	const onChangeReleaseDate = (releaseDate: string) => {
		setValue((oldValue) => ({ ...oldValue, releaseDate }));
	};

	useEffect(() => {
		if (year) {
			const yearDate = convertYearToDate(
				year,
				value.op || Operator.GREATER_THAN_OR_EQUAL
			)?.toString();
			setValue((oldValue) => ({ ...oldValue, val: yearDate }));
		}
	}, [year, value.op]);

	useEffect(() => {
		if (yearRange) {
			setValue((oldValue) => ({ ...oldValue, val: yearRange }));
		}
	}, [yearRange]);

	const onChangeOperatorSelect = (
		operator: SingleValue<SelectOption> | MultiValue<SelectOption>
	) => {
		const selectedOperator = (operator as SingleValue<SelectOption>)?.value as Operator;

		if (selectedOperator !== value.op) {
			setValue((oldValue) => ({
				...oldValue,
				operator: value,
				val: undefined,
			}));
		}
	};

	const handleSubmit = async () => {
		const errors = await validateForm(value, RELEASE_DATE_FILTER_FORM_SCHEMA());
		setFormErrors(errors);
		if (!errors) {
			onSubmit(value);
		}
	};

	const handleReset = () => {
		setValue(initialFilterValue());
		onReset();
	};

	const renderInputField = () => {
		if (yearsSelected && showRange) {
			return (
				<YearRangeInput
					disabled={disabled}
					showLabels
					id="releaseDate"
					onChange={(e) => {
						setYearRange(e.target.value);
					}}
					value={yearRange}
				/>
			);
		}
		if (showRange) {
			const split = ((value.val || '') as string).split(SEPARATOR, 2);

			const from: Date | undefined = split[0] ? parseISO(split[0]) : undefined;
			const to: Date | undefined = split[1] ? parseISO(split[1]) : undefined;

			return (
				<DateRangeInput
					disabled={disabled}
					showLabels
					id="releaseDate"
					onChange={(newFromDate: Date | undefined, newToDate: Date | undefined) => {
						onChangeReleaseDate(
							`${newFromDate ? newFromDate.toISOString() : ''}${SEPARATOR}${newToDate ? newToDate.toISOString() : ''}`
						);
					}}
					from={from}
					to={to}
				/>
			);
		}
		if (yearsSelected) {
			return (
				<YearInput
					label={getSelectValue(operators, value.op)?.label}
					disabled={disabled}
					id="releaseDate"
					onChange={(e) => onChangeYear(e)}
					value={year}
				/>
			);
		}
		const releaseDate = value.val?.split(SEPARATOR, 2)[0];
		return (
			<DateInput
				label={getSelectValue(operators, value.op)?.label}
				disabled={disabled}
				id="releaseDate"
				onChange={(date) => {
					onChangeDateInput(date);
				}}
				value={releaseDate ? parseISO(releaseDate) : undefined}
			/>
		);
	};

	return (
		<>
			<div className={clsx(className, styles.releaseDate, 'u-px-20 u-px-32-md')}>
				<FormControl
					className={clsx('u-mb-24 c-form-control--label-hidden')}
					errors={[<RedFormWarning error={formErrors?.op} key="form-error--operator" />]}
					id={'release-date-filter-form--operator'}
					label={tHtml(
						'modules/visitor-space/components/releaseDate-filter-form/releaseDate-filter-form___operator'
					)}
				>
					<ReactSelect
						isDisabled={disabled}
						components={{ IndicatorSeparator: () => null }}
						inputId={'release-date-filter-form--operator--select'}
						onChange={(newValue) => {
							onChangeOperatorSelect(newValue);
						}}
						options={operators}
						value={getSelectValue(operators, value.val)}
					/>
				</FormControl>
			</div>
			<div className={clsx(styles.releaseDate, 'u-px-20 u-px-32-md')}>
				<FormControl
					className="u-mb-24 c-form-control--label-hidden"
					errors={[<RedFormWarning error={formErrors?.val} key="form-error--release-date" />]}
					id={'release-date-filter-form--release-date'}
					label={tHtml(
						'modules/visitor-space/components/releaseDate-filter-form/releaseDate-filter-form___waarde'
					)}
				>
					<SelectDateOrYear
						yearsSelected={yearsSelected}
						setYearsSelected={setYearsSelected}
						showPluralLabel={showRange}
					/>
					{renderInputField()}
				</FormControl>
			</div>

			<FilterFormButtons onSubmit={handleSubmit} onReset={handleReset} />
		</>
	);
};

export default ReleaseDateFilterForm;
