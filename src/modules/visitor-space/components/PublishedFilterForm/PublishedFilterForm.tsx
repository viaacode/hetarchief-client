import { yupResolver } from '@hookform/resolvers/yup';
import { FormControl, ReactSelect, SelectOption } from '@meemoo/react-components';
import clsx from 'clsx';
import { endOfDay, parseISO, startOfDay } from 'date-fns';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { SingleValue } from 'react-select';
import { useQueryParams } from 'use-query-params';

import { SEPARATOR } from '@shared/const';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { isRange, Operator } from '@shared/types';
import {
	PUBLISHED_FILTER_FORM_QUERY_PARAM_CONFIG,
	PUBLISHED_FILTER_FORM_SCHEMA,
	PublishedFilterFormProps,
	PublishedFilterFormState,
} from '@visitor-space/components';
import { getOperators } from '@visitor-space/utils';

import { MetadataProp } from '../../types';
import { getSelectValue } from '../../utils/select';
import { DateInput } from '../DateInput';
import { DateRangeInput } from '../DateRangeInput';
import { SelectDateOrYear } from '../SelectDateOrYear';
import { YearInput } from '../YearInput';
import { YearRangeInput } from '../YearRangeInput';

import styles from './PublishedFilterForm.module.scss';

const labelKeys: Record<keyof PublishedFilterFormState, string> = {
	operator: 'PublishedFilterForm__operator',
	published: 'PublishedFilterForm__published',
};

const defaultValues: PublishedFilterFormState = {
	operator: Operator.GreaterThanOrEqual,
	published: undefined,
};

const PublishedFilterForm: FC<PublishedFilterFormProps> = ({ children, className, disabled }) => {
	const { tHtml } = useTranslation();
	const [query] = useQueryParams(PUBLISHED_FILTER_FORM_QUERY_PARAM_CONFIG);

	const initial = query?.published?.[0];

	const [showRange, setShowRange] = useState(isRange(initial?.op));
	const [form, setForm] = useState<PublishedFilterFormState>(defaultValues);
	const [yearsSelected, setYearsSelected] = useState(false);
	const [year, setYear] = useState<string | undefined>(undefined);
	const [yearRange, setYearRange] = useState<string | undefined>(undefined);

	const {
		clearErrors,
		control,
		formState: { errors },
		handleSubmit,
		setValue,
	} = useForm<PublishedFilterFormState>({
		resolver: yupResolver(PUBLISHED_FILTER_FORM_SCHEMA()),
		defaultValues,
	});

	const operators = useMemo(() => getOperators(MetadataProp.PublishedAt), []);

	// Effects

	useEffect(() => {
		setValue('published', form.published);
		setValue('operator', form.operator);
		setShowRange(isRange(form.operator));
	}, [form, setValue]);

	useEffect(() => {
		if (initial) {
			const { val, op } = initial;

			val && setForm((oldForm) => ({ ...oldForm, published: val }));
			op && setForm((oldForm) => ({ ...oldForm, operator: op as Operator }));

			setShowRange(isRange(op)); // Not covered by other useEffects in time
		}
	}, [initial]);

	// Events

	const convertToRange = (date: Date) => {
		try {
			const parsedFrom = startOfDay(date).toISOString();
			const parsedTo = endOfDay(date).toISOString();

			const value = `${parsedFrom}${SEPARATOR}${parsedTo}`;

			setForm((oldForm) => ({ ...oldForm, published: value }));
		} catch (err) {
			// ignore invalid dates since the user can still be typing something
		}
	};

	const onChangePublished = (published: string) => {
		setForm((oldForm) => ({ ...oldForm, published }));
	};

	const convertYearToDate = useCallback(
		(yearString: string) => {
			const startOfYear = `${yearString}-01-01T00:00:00Z`;
			const endOfYear = `${yearString}-12-31T23:59:59Z`;

			if (form.operator === Operator.Equals) {
				return `${startOfYear}${SEPARATOR}${endOfYear}`;
			}

			if (form.operator === Operator.LessThanOrEqual) {
				return endOfYear;
			}

			return startOfYear;
		},
		[form.operator]
	);

	useEffect(() => {
		if (year) {
			const yearDate = convertYearToDate(year)?.toString();
			setForm((oldForm) => ({ ...oldForm, published: yearDate }));
		}
	}, [year, convertYearToDate, setForm]);

	useEffect(() => {
		if (yearRange) {
			setForm((oldForm) => ({ ...oldForm, published: yearRange }));
		}
	}, [yearRange, setForm]);

	const renderInputField = () => {
		if (yearsSelected && showRange) {
			return (
				<YearRangeInput
					disabled={disabled}
					showLabels
					id="published"
					onChange={(e) => {
						setYearRange(e.target.value);
					}}
					value={yearRange}
				/>
			);
		}
		if (showRange) {
			const split = ((form.published || '') as string).split(SEPARATOR, 2);

			const from: Date = split[0] ? parseISO(split[0]) : new Date();
			const to: Date = split[1] ? parseISO(split[1]) : new Date();

			return (
				<DateRangeInput
					disabled={disabled}
					showLabels
					id="published"
					onChange={(newFromDate: Date, newToDate: Date) => {
						onChangePublished(
							`${newFromDate.toISOString()}${SEPARATOR}${newToDate.toISOString()}`
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
					id="published"
					onChange={(e) => {
						if (e.target.value.length < 5) {
							setYear(e.target.value);
						}
					}}
					value={year}
				/>
			);
		}
		return (
			<DateInput
				label={getSelectValue(operators, form.operator)?.label}
				disabled={disabled}
				id="published"
				onChange={(date) => {
					if (form.operator === Operator.Equals) {
						convertToRange(date || new Date());
						return;
					}
					onChangePublished(date.toISOString());
				}}
				value={
					form.published ? parseISO(form.published.split(SEPARATOR, 2)[0]) : new Date()
				}
			/>
		);
	};

	return (
		<>
			<div
				className={clsx(
					className,
					styles['publishedFilterForm__operatorSelect'],
					'u-px-20 u-px-32:md'
				)}
			>
				<FormControl
					className="u-mb-24 c-form-control--label-hidden"
					errors={[errors.operator?.message]}
					id={labelKeys.operator}
					label={tHtml(
						'modules/visitor-space/components/published-filter-form/published-filter-form___operator'
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
										const value = (newValue as SingleValue<SelectOption>)
											?.value as Operator;

										if (value !== form.operator) {
											setForm({
												operator: value,
												published: defaultValues.published,
											});
										}
									}}
									options={operators}
									value={getSelectValue(operators, field.value)}
								/>
							);
						}}
					/>
				</FormControl>
			</div>
			<div className={clsx(styles['publishedFilterForm__date'], 'u-px-20 u-px-32:md')}>
				<FormControl
					className="u-mb-24 c-form-control--label-hidden"
					errors={[errors.published?.message]}
					id={labelKeys.published}
					label={tHtml(
						'modules/visitor-space/components/published-filter-form/published-filter-form___waarde'
					)}
				>
					<SelectDateOrYear
						yearsSelected={yearsSelected}
						setYearsSelected={setYearsSelected}
						showPluralLabel={showRange}
					/>
					<Controller control={control} name="published" render={renderInputField} />
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

export default PublishedFilterForm;
