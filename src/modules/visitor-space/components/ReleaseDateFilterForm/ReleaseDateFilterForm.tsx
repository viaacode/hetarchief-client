import { yupResolver } from '@hookform/resolvers/yup';
import { FormControl, ReactSelect, type SelectOption } from '@meemoo/react-components';
import clsx from 'clsx';
import { endOfDay, isValid, parseISO, startOfDay } from 'date-fns';
import React, { type ChangeEvent, type FC, useEffect, useMemo, useState } from 'react';
import { Controller, type UseFormHandleSubmit, useForm } from 'react-hook-form';
import type { MultiValue, SingleValue } from 'react-select';
import { useQueryParams } from 'use-query-params';

import { RedFormWarning } from '@shared/components/RedFormWarning/RedFormWarning';
import { SEPARATOR } from '@shared/const';
import { YEAR_LENGTH } from '@shared/const/date';
import { convertYearToDate } from '@shared/helpers/convert-year-to-date';
import { tHtml, tText } from '@shared/helpers/translate';

import { FilterProperty, Operator, isRange } from '../../types';
import { getSelectValue } from '../../utils/select';
import { DateInput } from '../DateInput';
import { DateRangeInput } from '../DateRangeInput';
import { SelectDateOrYear } from '../SelectDateOrYear';
import { YearInput } from '../YearInput';
import YearRangeInput from '../YearRangeInput/YearRangeInput';

import { getOperators } from 'modules/visitor-space/utils/advanced-filters';
import type { SubmitErrorHandler, SubmitHandler } from 'react-hook-form/dist/types/form';
import {
	RELEASE_DATE_FILTER_FORM_QUERY_PARAM_CONFIG,
	RELEASE_DATE_FILTER_FORM_SCHEMA,
} from './ReleaseDateFilterForm.const';
import styles from './ReleaseDateFilterForm.module.scss';
import type {
	ReleaseDateFilterFormProps,
	ReleaseDateFilterFormState,
} from './ReleaseDateFilterForm.types';

const labelKeys: Record<keyof ReleaseDateFilterFormState, string> = {
	releaseDate: 'ReleaseDateFilterForm__releaseDate',
	operator: 'ReleaseDateFilterForm__operator',
};

const defaultValues: ReleaseDateFilterFormState = {
	releaseDate: undefined,
	operator: Operator.GREATER_THAN_OR_EQUAL,
};

const VALID_YEAR_REGEX = /[1-9][0-9]{3}/g;

const ReleaseDateFilterForm: FC<ReleaseDateFilterFormProps> = ({
	children,
	className,
	disabled,
}) => {
	const [query] = useQueryParams(RELEASE_DATE_FILTER_FORM_QUERY_PARAM_CONFIG);

	const initialValue = query?.releaseDate?.[0];

	const [showRange, setShowRange] = useState(isRange(initialValue?.op));
	const [form, setForm] = useState<ReleaseDateFilterFormState>(defaultValues);

	const [yearsSelected, setYearsSelected] = useState(false);
	const [year, setYear] = useState<string | undefined>(undefined);
	const [yearRange, setYearRange] = useState<string | undefined>(undefined);

	const {
		clearErrors,
		control,
		formState: { errors },
		handleSubmit,
		setValue,
		setError,
	} = useForm<ReleaseDateFilterFormState>({
		resolver: yupResolver(RELEASE_DATE_FILTER_FORM_SCHEMA()),
		defaultValues,
	});

	const operators = useMemo(() => getOperators(FilterProperty.RELEASE_DATE), []);

	// Effects

	useEffect(() => {
		setValue('releaseDate', form.releaseDate);
		setValue('operator', form.operator);
		setShowRange(isRange(form.operator));
	}, [form, setValue]);

	useEffect(() => {
		if (initialValue) {
			const { val, op } = initialValue;

			op && setForm((oldForm) => ({ ...oldForm, operator: op as Operator }));
			val && setForm((oldForm) => ({ ...oldForm, releaseDate: val }));

			setShowRange(isRange(op)); // Not covered by other useEffects in time
		}
	}, [initialValue]);

	// Events

	const convertToRange = (date: Date) => {
		try {
			const parsedFrom = startOfDay(date).toISOString();
			const parsedTo = endOfDay(date).toISOString();

			const value = `${parsedFrom}${SEPARATOR}${parsedTo}`;

			setForm((oldForm) => ({ ...oldForm, releaseDate: value }));
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
			setForm((oldForm) => ({ ...oldForm, releaseDate: undefined }));
			return;
		}
		if (form.operator === Operator.EQUALS) {
			convertToRange(newDate);
			return;
		}
		onChangeReleaseDate((newDate || new Date()).toISOString());
	};

	const onChangeReleaseDate = (releaseDate: string) => {
		setForm((oldForm) => ({ ...oldForm, releaseDate }));
	};

	useEffect(() => {
		if (year) {
			const yearDate = convertYearToDate(year, form.operator)?.toString();
			setForm((oldForm) => ({ ...oldForm, releaseDate: yearDate }));
		}
	}, [year, form.operator]);

	useEffect(() => {
		if (yearRange) {
			setForm((oldForm) => ({ ...oldForm, releaseDate: yearRange }));
		}
	}, [yearRange]);

	const onChangeOperatorSelect = (
		operator: SingleValue<SelectOption> | MultiValue<SelectOption>
	) => {
		const value = (operator as SingleValue<SelectOption>)?.value as Operator;

		if (value !== form.operator) {
			setForm({
				operator: value,
				releaseDate: defaultValues.releaseDate,
			});
		}
	};

	const validateForm = (
		onValid: SubmitHandler<ReleaseDateFilterFormState>,
		onInvalid?: SubmitErrorHandler<ReleaseDateFilterFormState>
	) => {
		if (showRange) {
			// Date range
			const dates = form.releaseDate?.split(SEPARATOR, 2);
			if (dates && dates.length === 2) {
				const from = parseISO(dates[0]);
				const to = parseISO(dates[1]);
				if (from && to && from <= to) {
					clearErrors('releaseDate');
					return handleSubmit(onValid, onInvalid);
				}
				setError('releaseDate', {
					message: tText(
						'modules/visitor-space/components/release-date-filter-form/release-date-filter-form___de-startdatum-moet-kleiner-zijn-dan-de-einddatum'
					),
				});
				return;
			}
			setError('releaseDate', {
				message: tText(
					'modules/visitor-space/components/release-date-filter-form/release-date-filter-form___je-moet-zowel-een-start-als-eind-datum-opgeven'
				),
			});
			return;
		}

		// Single date input
		const date = parseISO(form.releaseDate?.split('--')?.[0] || '');
		if (date && isValid(date)) {
			clearErrors('releaseDate');
			return handleSubmit(onValid, onInvalid);
		}
		if (yearsSelected) {
			setError('releaseDate', {
				message: tText(
					'modules/visitor-space/components/release-date-filter-form/release-date-filter-form___een-geldig-jaar-moet-4-cijfers-bevatten'
				),
			});
		} else {
			setError('releaseDate', {
				message: tText(
					'modules/visitor-space/components/release-date-filter-form/release-date-filter-form___gelieve-een-geldige-datum-in-te-vullen'
				),
			});
		}
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
			const split = ((form.releaseDate || '') as string).split(SEPARATOR, 2);

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
					label={getSelectValue(operators, form.operator)?.label}
					disabled={disabled}
					id="releaseDate"
					onChange={(e) => onChangeYear(e)}
					value={year}
				/>
			);
		}
		const value = form.releaseDate?.split(SEPARATOR, 2)[0];
		return (
			<DateInput
				label={getSelectValue(operators, form.operator)?.label}
				disabled={disabled}
				id="releaseDate"
				onChange={(date) => {
					onChangeDateInput(date);
				}}
				value={value ? parseISO(value) : undefined}
			/>
		);
	};

	return (
		<>
			<div className={clsx(className, styles.releaseDate, 'u-px-32 u-px-20-md')}>
				<FormControl
					className={clsx('u-mb-24 c-form-control--label-hidden')}
					errors={[<RedFormWarning error={errors.operator?.message} key="form-error--operator" />]}
					id={labelKeys.operator}
					label={tHtml(
						'modules/visitor-space/components/releaseDate-filter-form/releaseDate-filter-form___operator'
					)}
				>
					<Controller
						control={control}
						name="operator"
						render={({ field }) => {
							// eslint-disable-next-line @typescript-eslint/no-unused-vars
							const { ref, ...rest } = field;
							return (
								<ReactSelect
									{...rest}
									isDisabled={disabled}
									components={{ IndicatorSeparator: () => null }}
									inputId={labelKeys.operator}
									onChange={(newValue) => {
										onChangeOperatorSelect(newValue);
									}}
									options={operators}
									value={getSelectValue(operators, field.value)}
								/>
							);
						}}
					/>
				</FormControl>
			</div>
			<div className={clsx(styles.releaseDateFilterForm__date, 'u-px-32 u-px-20-md')}>
				<FormControl
					className="u-mb-24 c-form-control--label-hidden"
					errors={[
						<RedFormWarning error={errors.releaseDate?.message} key="form-error--release-date" />,
					]}
					id={labelKeys.releaseDate}
					label={tHtml(
						'modules/visitor-space/components/releaseDate-filter-form/releaseDate-filter-form___waarde'
					)}
				>
					<SelectDateOrYear
						yearsSelected={yearsSelected}
						setYearsSelected={setYearsSelected}
						showPluralLabel={showRange}
					/>
					<Controller control={control} name="releaseDate" render={renderInputField} />
				</FormControl>
			</div>

			{children({
				values: form,
				reset: () => {
					setForm(defaultValues);
					setYear(undefined);
					setYearRange(undefined);
					clearErrors();
				},
				handleSubmit: validateForm as UseFormHandleSubmit<ReleaseDateFilterFormState>,
			})}
		</>
	);
};

export default ReleaseDateFilterForm;
