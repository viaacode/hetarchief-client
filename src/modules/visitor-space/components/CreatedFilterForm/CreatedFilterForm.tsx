import { yupResolver } from '@hookform/resolvers/yup';
import { FormControl, ReactSelect, SelectOption } from '@meemoo/react-components';
import clsx from 'clsx';
import { endOfDay, startOfDay } from 'date-fns';
import { ChangeEvent, FC, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { MultiValue, SingleValue } from 'react-select';
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
import YearRangeInput from '../YearRangeInput/YearRangeInput';

import {
	CREATED_FILTER_FORM_QUERY_PARAM_CONFIG,
	CREATED_FILTER_FORM_SCHEMA,
} from './CreatedFilterForm.const';
import styles from './CreatedFilterForm.module.scss';
import { CreatedFilterFormProps, CreatedFilterFormState } from './CreatedFilterForm.types';

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

	const initial = query?.created?.[0];

	const [showRange, setShowRange] = useState(isRange(initial?.op));
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
		if (initial) {
			const { val, op } = initial;

			op && setForm((f) => ({ ...f, operator: op as Operator }));
			val && setForm((f) => ({ ...f, created: val }));

			setShowRange(isRange(op)); // Not covered by other effect in time
		}
	}, [initial]);

	// Events

	const convertToRange = (date: Date) => {
		const parsedFrom = startOfDay(asDate(date) || 0).valueOf() || '';
		const parsedTo = endOfDay(asDate(date) || 0).valueOf() || '';

		const value = `${parsedFrom}${SEPARATOR}${parsedTo}`;

		setForm({ ...form, created: value });
	};

	const onChangeCreated = (created: string) => {
		setForm({ ...form, created });
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

	const onChangeYear = (e: ChangeEvent<HTMLInputElement>) => {
		const isNumberReg = new RegExp(/^\d+$/);
		const isNumber = isNumberReg.test(e.target.value) || e.target.value === '';

		if (isNumber && e.target.value.length < 5) {
			setYear(e.target.value);
		}
	};

	const onChangeDateInput = (date: Date | null) => {
		if (form.operator === Operator.Equals) {
			convertToRange(date || new Date());
			return;
		}
		onChangeCreated((date || new Date()).valueOf().toString());
	};

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

	useEffect(() => {
		if (year) {
			const yearDate = convertYearToDate(year)?.toString();
			setForm({ ...form, created: yearDate });
		}
	}, [year]);

	useEffect(() => {
		if (yearRange) {
			setForm({ ...form, created: yearRange });
		}
	}, [yearRange]);

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
						render={({ field }) => (
							<ReactSelect
								{...field}
								isDisabled={disabled}
								components={{ IndicatorSeparator: () => null }}
								inputId={labelKeys.operator}
								onChange={(newValue) => {
									onChangeOperatorSelect(newValue);
								}}
								options={operators}
								value={getSelectValue(operators, field.value)}
							/>
						)}
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
					<Controller
						control={control}
						name="created"
						render={() =>
							yearsSelected && showRange ? (
								<YearRangeInput
									disabled={disabled}
									showLabels
									id={labelKeys.created}
									onChange={(e) => {
										setYearRange(e.target.value);
									}}
									value={yearRange}
								/>
							) : showRange ? (
								<DateRangeInput
									disabled={disabled}
									showLabels
									id={labelKeys.created}
									onChange={(e) => {
										onChangeCreated(e.target.value);
									}}
									value={form.created}
								/>
							) : yearsSelected ? (
								<YearInput
									label={getSelectValue(operators, form.operator)?.label}
									disabled={disabled}
									id={labelKeys.created}
									onChange={(e) => onChangeYear(e)}
									value={year}
								/>
							) : (
								<DateInput
									label={getSelectValue(operators, form.operator)?.label}
									disabled={disabled}
									id={labelKeys.created}
									onChange={(date) => {
										onChangeDateInput(date);
									}}
									value={(form.created || '').toString().split(SEPARATOR, 2)[0]} // in case of EXACT, a range is used
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
					clearErrors();
				},
				handleSubmit,
			})}
		</>
	);
};

export default CreatedFilterForm;
