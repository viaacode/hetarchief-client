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

import { type DefaultFilterFormProps, type FilterValue, Operator } from '../../types';
import { getSelectValue } from '../../utils/select';
import { DateInput } from '../DateInput';
import { DateRangeInput } from '../DateRangeInput';
import { SelectDateOrYear } from '../SelectDateOrYear';
import { YearInput } from '../YearInput';
import YearRangeInput from '../YearRangeInput/YearRangeInput';
import styles from './ReleaseDateFilterForm.module.scss';

import { validateForm } from '@shared/helpers/validate-form';
import { IeObjectsSearchFilterField } from '@shared/types/ie-objects';
import {
	FILTER_FORM_SCHEMA,
	initialFilterValues,
} from '@visitor-space/components/AdvancedFilterForm/AdvancedFilterForm.const';
import FilterFormButtons from '@visitor-space/components/FilterMenu/FilterFormButtons/FilterFormButtons';
import {
	AdvancedFilterArrayParam,
	getOperators,
} from '@visitor-space/const/advanced-filter-array-param';

export const ReleaseDateFilterForm: FC<DefaultFilterFormProps> = ({
	id,
	className,
	disabled,
	initialValues,
	onSubmit,
	onReset,
}) => {
	const [initialValueFromQueryParams] = useQueryParam(
		IeObjectsSearchFilterField.RELEASE_DATE,
		AdvancedFilterArrayParam
	);
	const [values, setValues] = useState<FilterValue[]>(
		initialFilterValues(id, initialValues, initialValueFromQueryParams, Operator.GTE)
	);
	const [formErrors, setFormErrors] = useState<Record<keyof FilterValue, string> | null>(null);

	const [yearsSelected, setYearsSelected] = useState(false);
	const [year, setYear] = useState<string | undefined>(undefined);
	const [yearRange, setYearRange] = useState<string | undefined>(undefined);

	const operators = useMemo(() => getOperators(IeObjectsSearchFilterField.RELEASE_DATE), []);

	// Events

	const convertToRange = (date: Date) => {
		try {
			const parsedFrom = startOfDay(date).toISOString();
			const parsedTo = endOfDay(date).toISOString();

			const value = `${parsedFrom}${SEPARATOR}${parsedTo}`;

			setValues((oldValues): FilterValue[] => [{ ...oldValues[0], multiValue: [value] }]);
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
			setValues((oldValues): FilterValue[] => [{ ...oldValues[0], multiValue: [] }]);
			return;
		}
		if (values[0]?.operator === Operator.IS) {
			convertToRange(newDate);
			return;
		}
		onChangeReleaseDate([(newDate || new Date()).toISOString()]);
	};

	const onChangeReleaseDate = (releaseDates: [string, string] | [string]) => {
		setValues((oldValues): FilterValue[] => [{ ...oldValues[0], multiValue: releaseDates }]);
	};

	useEffect(() => {
		if (year && values[0]?.operator) {
			const yearDate = convertYearToDate(year, values[0]?.operator || Operator.GTE)?.toString();
			setValues((oldValues): FilterValue[] => [{ ...oldValues[0], multiValue: [yearDate] }]);
		}
	}, [year, values[0]?.operator]);

	useEffect(() => {
		if (yearRange) {
			setValues((oldValues): FilterValue[] => [{ ...oldValues[0], multiValue: [yearRange] }]);
		}
	}, [yearRange]);

	const onChangeOperatorSelect = (
		operator: SingleValue<SelectOption> | MultiValue<SelectOption>
	) => {
		const selectedOperator = (operator as SingleValue<SelectOption>)?.value as Operator;

		if (selectedOperator !== values[0]?.operator) {
			setValues((oldValues): FilterValue[] => [{ ...oldValues[0], operator: selectedOperator }]);
		}
	};

	const handleSubmit = async () => {
		const errors = await validateForm(values[0], FILTER_FORM_SCHEMA());
		setFormErrors(errors);
		if (!errors) {
			onSubmit(values);
		}
	};

	const handleReset = () => {
		setValues(initialFilterValues(id, undefined, undefined, Operator.GTE));
		onReset();
	};

	const renderInputField = () => {
		if (values[0]?.operator === Operator.BETWEEN) {
			if (yearsSelected) {
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
			const dates = values[0]?.multiValue || [];

			const from: Date | undefined = dates[0] ? parseISO(dates[0]) : undefined;
			const to: Date | undefined = dates[1] ? parseISO(dates[1]) : undefined;

			return (
				<DateRangeInput
					disabled={disabled}
					showLabels
					id="releaseDate"
					onChange={(newFromDate: Date | undefined, newToDate: Date | undefined) => {
						onChangeReleaseDate([newFromDate?.toISOString() || '', newToDate?.toISOString() || '']);
					}}
					from={from}
					to={to}
				/>
			);
		}
		if (yearsSelected) {
			return (
				<YearInput
					label={getSelectValue(operators, values[0]?.operator)?.label}
					disabled={disabled}
					id="releaseDate"
					onChange={(e) => onChangeYear(e)}
					value={year}
				/>
			);
		}
		const releaseDate = values[0]?.multiValue?.[0];
		return (
			<DateInput
				label={getSelectValue(operators, values[0]?.operator)?.label}
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
					errors={[<RedFormWarning error={formErrors?.operator} key="form-error--operator" />]}
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
						value={getSelectValue(operators, values[0]?.operator)}
					/>
				</FormControl>
			</div>
			<div className={clsx(styles.releaseDate, 'u-px-20 u-px-32-md')}>
				<FormControl
					className="u-mb-24 c-form-control--label-hidden"
					errors={[
						<RedFormWarning error={formErrors?.multiValue} key="form-error--release-date" />,
					]}
					id={'release-date-filter-form--release-date'}
					label={tHtml(
						'modules/visitor-space/components/releaseDate-filter-form/releaseDate-filter-form___waarde'
					)}
				>
					<SelectDateOrYear
						yearsSelected={yearsSelected}
						setYearsSelected={setYearsSelected}
						showPluralLabel={values[0]?.operator === Operator.BETWEEN}
					/>
					{renderInputField()}
				</FormControl>
			</div>

			<FilterFormButtons onSubmit={handleSubmit} onReset={handleReset} />
		</>
	);
};
