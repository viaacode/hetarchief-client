import { yupResolver } from '@hookform/resolvers/yup';
import { FormControl, ReactSelect, SelectOption } from '@meemoo/react-components';
import clsx from 'clsx';
import { endOfDay, startOfDay } from 'date-fns';
import { FC, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { SingleValue } from 'react-select';
import { useQueryParams } from 'use-query-params';

import { SEPARATOR } from '@shared/const';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { isRange, Operator } from '@shared/types';
import { asDate } from '@shared/utils';

import { MetadataProp } from '../../types';
import { getOperators } from '../../utils';
import { getSelectValue } from '../../utils/select';
import { DateInput } from '../DateInput';
import { DateRangeInput } from '../DateRangeInput';
import { SelectDateOrYear } from '../SelectDateOrYear';
import { YearInput } from '../YearInput';
import { YearRangeInput } from '../YearRangeInput';

import {
	PUBLISHED_FILTER_FORM_QUERY_PARAM_CONFIG,
	PUBLISHED_FILTER_FORM_SCHEMA,
} from './PublishedFilterForm.const';
import styles from './PublishedFilterForm.module.scss';
import { PublishedFilterFormProps, PublishedFilterFormState } from './PublishedFilterForm.types';

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

			val && setForm((f) => ({ ...f, published: val }));
			op && setForm((f) => ({ ...f, operator: op as Operator }));

			setShowRange(isRange(op)); // Not covered by other effect in time
		}
	}, [initial]);

	// Events

	const convertToRange = (date: Date) => {
		const parsedFrom = startOfDay(asDate(date) || 0).valueOf() || '';
		const parsedTo = endOfDay(asDate(date) || 0).valueOf() || '';

		const value = `${parsedFrom}${SEPARATOR}${parsedTo}`;

		setForm({ ...form, published: value });
	};

	const onChangePublished = (published: string) => {
		setForm({ ...form, published });
	};

	const convertYearToDate = (yearString: string) => {
		const startOfYear = asDate(`01/01/${yearString}`);
		const endOfYear = endOfDay(asDate(`12/31/${yearString}`) || 0);

		if (form.operator === Operator.Equals) {
			const dateRange = `${startOfYear}${SEPARATOR}${endOfYear}`;
			return dateRange;
		}

		if (form.operator === Operator.LessThanOrEqual) {
			return endOfYear;
		}

		return startOfYear;
	};

	useEffect(() => {
		if (year) {
			const yearDate = convertYearToDate(year)?.toString();
			setForm({ ...form, published: yearDate });
		}
	}, [year]);

	useEffect(() => {
		if (yearRange) {
			setForm({ ...form, published: yearRange });
		}
	}, [yearRange]);

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
						render={({ field }) => (
							<ReactSelect
								{...field}
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
						)}
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
					<Controller
						control={control}
						name="published"
						render={() =>
							yearsSelected && showRange ? (
								<YearRangeInput
									disabled={disabled}
									showLabels
									id={labelKeys.published}
									onChange={(e) => {
										setYearRange(e.target.value);
									}}
									value={yearRange}
								/>
							) : showRange ? (
								<DateRangeInput
									disabled={disabled}
									showLabels
									id={labelKeys.published}
									onChange={(e) => {
										onChangePublished(e.target.value);
									}}
									value={form.published}
								/>
							) : yearsSelected ? (
								<YearInput
									label={getSelectValue(operators, form.operator)?.label}
									disabled={disabled}
									id={labelKeys.published}
									onChange={(e) => {
										if (e.target.value.length < 5) {
											setYear(e.target.value);
										}
									}}
									value={year}
								/>
							) : (
								<DateInput
									label={getSelectValue(operators, form.operator)?.label}
									disabled={disabled}
									id={labelKeys.published}
									onChange={(date) => {
										if (form.operator === Operator.Equals) {
											convertToRange(date || new Date());
											return;
										}
										onChangePublished(
											(date || new Date()).valueOf().toString()
										);
									}}
									value={(form.published || '').toString().split(SEPARATOR, 2)[0]} // in case of EXACT, a range is used
								/>
							)
						}
					/>
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
