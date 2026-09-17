import { yupResolver } from '@hookform/resolvers/yup';
import { FormControl, ReactSelect, type SelectOption } from '@meemoo/react-components';
import { RedFormWarning } from '@shared/components/RedFormWarning/RedFormWarning';
import { SEPARATOR } from '@shared/const';
import { YEAR_LENGTH } from '@shared/const/date';
import { convertYearToDate } from '@shared/helpers/convert-year-to-date';
import { tHtml, tText } from '@shared/helpers/translate';
import { IeObjectsSearchOperator } from '@shared/types/ie-objects';
import { SEARCH_PAGE_QUERY_PARAM_CONFIG } from '@visitor-space/const';
import { getOperators } from '@visitor-space/utils/advanced-filters';
import clsx from 'clsx';
import { endOfDay, isValid, parseISO, startOfDay } from 'date-fns';
import React, { type ChangeEvent, type FC, useEffect, useMemo, useState } from 'react';
import { Controller, type UseFormHandleSubmit, useForm } from 'react-hook-form';
import type { SubmitErrorHandler, SubmitHandler } from 'react-hook-form/dist/types/form';
import type { MultiValue, SingleValue } from 'react-select';
import { useQueryParams } from 'use-query-params';
import { type AdvancedFilter, isRange } from '../../types';
import { getSelectValue } from '../../utils/select';
import { DateInput } from '../DateInput';
import { DateRangeInput } from '../DateRangeInput';
import { SelectDateOrYear } from '../SelectDateOrYear';
import { YearInput } from '../YearInput';
import YearRangeInput from '../YearRangeInput/YearRangeInput';
import { DATE_FILTER_FORM_SCHEMA } from './DateFilterForm.const';
import styles from './DateFilterForm.module.scss';
import type { DateFilterFormProps, DateFilterFormState } from './DateFilterForm.types';

const labelKeys: Record<keyof DateFilterFormState, string> = {
	date: 'DateFilterForm__date',
	operator: 'DateFilterForm__operator',
};

const defaultValues: DateFilterFormState = {
	date: undefined,
	operator: IeObjectsSearchOperator.GTE,
};

/**
 * Shared form for every date filter (creatiedatum, uitgavedatum, publicatiedatum): pick date or
 * year, pick an operator and fill in the matching input(s).
 */
const DateFilterForm: FC<DateFilterFormProps> = ({ children, className, disabled, filter }) => {
	const [query] = useQueryParams(SEARCH_PAGE_QUERY_PARAM_CONFIG);

	const initialValue = (query[filter.id] as AdvancedFilter[] | undefined)?.[0];

	const [showRange, setShowRange] = useState(isRange(initialValue?.op));
	const [form, setForm] = useState<DateFilterFormState>(defaultValues);

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
	} = useForm<DateFilterFormState>({
		resolver: yupResolver(DATE_FILTER_FORM_SCHEMA()),
		defaultValues,
	});

	const operators = useMemo(() => getOperators(filter.id), [filter.id]);

	// Effects

	useEffect(() => {
		setValue('date', form.date);
		setValue('operator', form.operator);
		setShowRange(isRange(form.operator));
	}, [form, setValue]);

	useEffect(() => {
		if (initialValue) {
			const { val, op } = initialValue;

			op && setForm((oldForm) => ({ ...oldForm, operator: op as IeObjectsSearchOperator }));
			val && setForm((oldForm) => ({ ...oldForm, date: val }));

			setShowRange(isRange(op)); // Not covered by other useEffects in time
		}
	}, [initialValue]);

	// Events

	const convertToRange = (date: Date) => {
		try {
			const parsedFrom = startOfDay(date).toISOString();
			const parsedTo = endOfDay(date).toISOString();

			const value = `${parsedFrom}${SEPARATOR}${parsedTo}`;

			setForm((oldForm) => ({ ...oldForm, date: value }));
		} catch (_err) {
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
			setForm((oldForm) => ({ ...oldForm, date: undefined }));
			return;
		}
		if (form.operator === IeObjectsSearchOperator.IS) {
			convertToRange(newDate);
			return;
		}
		onChangeDate((newDate || new Date()).toISOString());
	};

	const onChangeDate = (date: string) => {
		setForm((oldForm) => ({ ...oldForm, date }));
	};

	useEffect(() => {
		if (year) {
			const yearDate = convertYearToDate(year, form.operator)?.toString();
			setForm((oldForm) => ({ ...oldForm, date: yearDate }));
		}
	}, [year, form.operator]);

	useEffect(() => {
		if (yearRange) {
			setForm((oldForm) => ({ ...oldForm, date: yearRange }));
		}
	}, [yearRange]);

	const onChangeOperatorSelect = (
		operator: SingleValue<SelectOption> | MultiValue<SelectOption>
	) => {
		const value = (operator as SingleValue<SelectOption>)?.value as IeObjectsSearchOperator;

		if (value !== form.operator) {
			setForm({
				operator: value,
				date: defaultValues.date,
			});
		}
	};

	const validateForm = (
		onValid: SubmitHandler<DateFilterFormState>,
		onInvalid?: SubmitErrorHandler<DateFilterFormState>
	) => {
		if (showRange) {
			// Date range
			const dates = form.date?.split(SEPARATOR, 2);
			if (dates && dates.length === 2) {
				const from = parseISO(dates[0]);
				const to = parseISO(dates[1]);
				if (from && to && from <= to) {
					clearErrors('date');
					return handleSubmit(onValid, onInvalid);
				}
				setError('date', {
					message: tText(
						'modules/visitor-space/components/release-date-filter-form/release-date-filter-form___de-startdatum-moet-kleiner-zijn-dan-de-einddatum'
					),
				});
				return;
			}
			setError('date', {
				message: tText(
					'modules/visitor-space/components/release-date-filter-form/release-date-filter-form___je-moet-zowel-een-start-als-eind-datum-opgeven'
				),
			});
			return;
		}

		// Single date input
		const date = parseISO(form.date?.split('--')?.[0] || '');
		if (date && isValid(date)) {
			clearErrors('date');
			return handleSubmit(onValid, onInvalid);
		}
		if (yearsSelected) {
			setError('date', {
				message: tText(
					'modules/visitor-space/components/release-date-filter-form/release-date-filter-form___een-geldig-jaar-moet-4-cijfers-bevatten'
				),
			});
		} else {
			setError('date', {
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
					id="date"
					onChange={(e) => {
						setYearRange(e.target.value);
					}}
					value={yearRange}
					ariaLabel={tText(
						'modules/visitor-space/components/release-date-filter-form/release-date-filter-form___release-datum'
					)}
				/>
			);
		}
		if (showRange) {
			const split = ((form.date || '') as string).split(SEPARATOR, 2);

			const from: Date | undefined = split[0] ? parseISO(split[0]) : undefined;
			const to: Date | undefined = split[1] ? parseISO(split[1]) : undefined;

			return (
				<DateRangeInput
					disabled={disabled}
					showLabels
					id="date"
					onChange={(newFromDate: Date | undefined, newToDate: Date | undefined) => {
						onChangeDate(
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
					id="date"
					onChange={(e) => onChangeYear(e)}
					value={year}
					ariaLabel={tText(
						'modules/visitor-space/components/release-date-filter-form/release-date-filter-form___release-datum-input-aria-label'
					)}
				/>
			);
		}
		const value = form.date?.split(SEPARATOR, 2)[0];
		return (
			<DateInput
				label={getSelectValue(operators, form.operator)?.label}
				disabled={disabled}
				id="date"
				onChange={(date) => {
					onChangeDateInput(date);
				}}
				value={value ? parseISO(value) : undefined}
				ariaLabel={tText(
					'modules/visitor-space/components/release-date-filter-form/release-date-filter-form___release-datum'
				)}
			/>
		);
	};

	return (
		<>
			<div className={clsx(className, 'u-px-32 u-px-20-md')}>
				<FormControl
					className={clsx('u-mb-8 c-form-control--label-hidden')}
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
							// biome-ignore lint/correctness/noUnusedVariables: No need for the ref
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
			<div className={clsx(styles.dateFilterForm__fields, 'u-px-32 u-px-20-md')}>
				<FormControl
					className="u-mb-24 c-form-control--label-hidden"
					errors={[<RedFormWarning error={errors.date?.message} key="form-error--date" />]}
					id={labelKeys.date}
					label={tHtml(
						'modules/visitor-space/components/releaseDate-filter-form/releaseDate-filter-form___waarde'
					)}
				>
					<SelectDateOrYear
						yearsSelected={yearsSelected}
						setYearsSelected={setYearsSelected}
						showPluralLabel={showRange}
					/>
					<Controller control={control} name="date" render={renderInputField} />
				</FormControl>
			</div>

			{children({
				values: {
					[filter.id]: form.date ? [{ prop: filter.id, op: form.operator, val: form.date }] : [],
				},
				reset: () => {
					setForm(defaultValues);
					setYear(undefined);
					setYearRange(undefined);
					clearErrors();
				},
				handleSubmit: validateForm as UseFormHandleSubmit<DateFilterFormState>,
			})}
		</>
	);
};

export default DateFilterForm;
