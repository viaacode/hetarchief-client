import { yupResolver } from '@hookform/resolvers/yup';
import { FormControl, ReactSelect, type SelectOption } from '@meemoo/react-components';
import clsx from 'clsx';
import { endOfDay, parseISO, startOfDay } from 'date-fns';
import React, { type ChangeEvent, type FC, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { type MultiValue, type SingleValue } from 'react-select';
import { useQueryParams } from 'use-query-params';

import { SEPARATOR } from '@shared/const';
import { YEAR_LENGTH } from '@shared/const/date';
import { convertYearToDate } from '@shared/helpers/convert-year-to-date';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { isRange, Operator } from '@shared/types';
import { getOperators } from '@visitor-space/utils/metadata';

import { MetadataProp } from '../../types';
import { getSelectValue } from '../../utils/select';
import { DateInput } from '../DateInput';
import { DateRangeInput } from '../DateRangeInput';
import { SelectDateOrYear } from '../SelectDateOrYear';
import { YearInput } from '../YearInput';
import YearRangeInput from '../YearRangeInput/YearRangeInput';

import {
	CREATED_FILTER_FORM_QUERY_PARAM_CONFIG,
	CREATED_FILTER_FORM_SCHEMA,
} from './CreatedFilterForm.const';
import styles from './CreatedFilterForm.module.scss';
import {
	type CreatedFilterFormProps,
	type CreatedFilterFormState,
} from './CreatedFilterForm.types';

const labelKeys: Record<keyof CreatedFilterFormState, string> = {
	created: 'CreatedFilterForm__created',
	operator: 'CreatedFilterForm__operator',
};

const defaultValues: CreatedFilterFormState = {
	created: undefined,
	operator: Operator.GreaterThanOrEqual,
};

const CreatedFilterForm: FC<CreatedFilterFormProps> = ({ children, className, disabled }) => {
	const { tHtml } = useTranslation();
	const [query] = useQueryParams(CREATED_FILTER_FORM_QUERY_PARAM_CONFIG);

	const initialValue = query?.created?.[0];

	const [showRange, setShowRange] = useState(isRange(initialValue?.op));
	const [form, setForm] = useState<CreatedFilterFormState>(defaultValues);

	const [yearsSelected, setYearsSelected] = useState(false);
	const [year, setYear] = useState<string | undefined>(undefined);
	const [yearRange, setYearRange] = useState<string | undefined>(undefined);

	const {
		clearErrors,
		control,
		formState: { errors },
		handleSubmit,
		setValue,
	} = useForm<CreatedFilterFormState>({
		resolver: yupResolver(CREATED_FILTER_FORM_SCHEMA()),
		defaultValues,
	});

	const operators = useMemo(() => getOperators(MetadataProp.CreatedAt), []);

	// Effects

	useEffect(() => {
		setValue('created', form.created);
		setValue('operator', form.operator);
		setShowRange(isRange(form.operator));
	}, [form, setValue]);

	useEffect(() => {
		if (initialValue) {
			const { val, op } = initialValue;

			op && setForm((oldForm) => ({ ...oldForm, operator: op as Operator }));
			val && setForm((oldForm) => ({ ...oldForm, created: val }));

			setShowRange(isRange(op)); // Not covered by other useEffects in time
		}
	}, [initialValue, setForm]);

	// Events

	const convertToRange = (date: Date) => {
		try {
			const parsedFrom = startOfDay(date).toISOString();
			const parsedTo = endOfDay(date).toISOString();

			const value = `${parsedFrom}${SEPARATOR}${parsedTo}`;

			setForm((oldForm) => ({ ...oldForm, created: value }));
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
			setForm((oldForm) => ({ ...oldForm, created: undefined }));
			return;
		}
		if (form.operator === Operator.Equals) {
			convertToRange(newDate);
			return;
		}
		onChangeCreated((newDate || new Date()).toISOString());
	};

	const onChangeCreated = (created: string) => {
		setForm((oldForm) => ({ ...oldForm, created }));
	};

	useEffect(() => {
		if (year) {
			const yearDate = convertYearToDate(year, form.operator)?.toString();
			setForm((oldForm) => ({ ...oldForm, created: yearDate }));
		}
	}, [year, setForm, form.operator]);

	useEffect(() => {
		if (yearRange) {
			setForm((oldForm) => ({ ...oldForm, created: yearRange }));
		}
	}, [setForm, yearRange]);

	const onChangeOperatorSelect = (
		operator: SingleValue<SelectOption> | MultiValue<SelectOption>
	) => {
		const value = (operator as SingleValue<SelectOption>)?.value as Operator;

		if (value !== form.operator) {
			setForm({
				operator: value,
				created: defaultValues.created,
			});
		}
	};

	const renderInputField = () => {
		if (yearsSelected && showRange) {
			return (
				<YearRangeInput
					disabled={disabled}
					showLabels
					id="created"
					onChange={(e) => {
						setYearRange(e.target.value);
					}}
					value={yearRange}
				/>
			);
		}
		if (showRange) {
			const split = ((form.created || '') as string).split(SEPARATOR, 2);

			const from: Date | undefined = split[0] ? parseISO(split[0]) : undefined;
			const to: Date | undefined = split[1] ? parseISO(split[1]) : undefined;

			return (
				<DateRangeInput
					disabled={disabled}
					showLabels
					id="created"
					onChange={(newFromDate: Date | undefined, newToDate: Date | undefined) => {
						onChangeCreated(
							`${newFromDate ? newFromDate.toISOString() : ''}${SEPARATOR}${
								newToDate ? newToDate.toISOString() : ''
							}`
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
					id="created"
					onChange={(e) => onChangeYear(e)}
					value={year}
				/>
			);
		}
		const value = form.created?.split(SEPARATOR, 2)[0];
		return (
			<DateInput
				label={getSelectValue(operators, form.operator)?.label}
				disabled={disabled}
				id="created"
				onChange={(date) => {
					onChangeDateInput(date);
				}}
				value={value ? parseISO(value) : undefined}
			/>
		);
	};

	return (
		<>
			<div
				className={clsx(
					className,
					styles['createdFilterForm__operatorSelect'],
					'u-px-20 u-px-32:md'
				)}
			>
				<FormControl
					className={clsx('u-mb-24 c-form-control--label-hidden')}
					errors={[errors.operator?.message]}
					id={labelKeys.operator}
					label={tHtml(
						'modules/visitor-space/components/created-filter-form/created-filter-form___operator'
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
			<div className={clsx(styles['createdFilterForm__date'], 'u-px-20 u-px-32:md')}>
				<FormControl
					className="u-mb-24 c-form-control--label-hidden"
					errors={[errors.created?.message]}
					id={labelKeys.created}
					label={tHtml(
						'modules/visitor-space/components/created-filter-form/created-filter-form___waarde'
					)}
				>
					<SelectDateOrYear
						yearsSelected={yearsSelected}
						setYearsSelected={setYearsSelected}
						showPluralLabel={showRange}
					/>
					<Controller control={control} name="created" render={renderInputField} />
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
				handleSubmit,
			})}
		</>
	);
};

export default CreatedFilterForm;
