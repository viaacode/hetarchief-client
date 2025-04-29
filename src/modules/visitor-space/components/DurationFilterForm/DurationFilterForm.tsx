import { yupResolver } from '@hookform/resolvers/yup';
import { FormControl, ReactSelect, type SelectOption } from '@meemoo/react-components';
import clsx from 'clsx';
import { isNil } from 'lodash-es';
import { type ChangeEvent, type FC, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import type { SingleValue } from 'react-select';
import { useQueryParams } from 'use-query-params';

import { RedFormWarning } from '@shared/components/RedFormWarning/RedFormWarning';
import { SEPARATOR } from '@shared/const';
import { tHtml } from '@shared/helpers/translate';
import {
	DURATION_FILTER_FORM_QUERY_PARAM_CONFIG,
	DURATION_FILTER_FORM_SCHEMA,
} from '@visitor-space/components/DurationFilterForm/DurationFilterForm.const';
import type {
	DurationFilterFormProps,
	DurationFilterFormState,
} from '@visitor-space/components/DurationFilterForm/DurationFilterForm.types';

import { FilterProperty, Operator, SearchFilterId, isRange } from '../../types';
import { getSelectValue } from '../../utils/select';
import { DurationInput } from '../DurationInput';
import { defaultValue } from '../DurationInput/DurationInput';
import { DurationRangeInput } from '../DurationRangeInput';

import { getOperators } from 'modules/visitor-space/utils/advanced-filters';

const labelKeys: Record<keyof DurationFilterFormState, string> = {
	duration: 'DurationFilterForm__duration',
	operator: 'DurationFilterForm__operator',
};

const defaultValues: DurationFilterFormState = {
	duration: undefined,
	operator: Operator.LESS_THAN_OR_EQUAL,
};

const DurationFilterForm: FC<DurationFilterFormProps> = ({ children, className, disabled }) => {
	const [query] = useQueryParams(DURATION_FILTER_FORM_QUERY_PARAM_CONFIG);

	const initial = query?.[SearchFilterId.Duration]?.[0];

	const [showRange, setShowRange] = useState(isRange(initial?.op));
	const [form, setForm] = useState<DurationFilterFormState>(defaultValues);

	const {
		clearErrors,
		control,
		formState: { errors },
		handleSubmit,
		setValue,
	} = useForm<DurationFilterFormState>({
		resolver: yupResolver(DURATION_FILTER_FORM_SCHEMA()),
		defaultValues,
		reValidateMode: 'onChange',
	});

	const operators = useMemo(() => getOperators(FilterProperty.DURATION), []);

	// Effects

	useEffect(() => {
		setValue(SearchFilterId.Duration, form[SearchFilterId.Duration]);
		setValue('operator', form.operator);

		setShowRange(isRange(form.operator));
	}, [form, setValue]);

	useEffect(() => {
		if (initial) {
			const { val, op } = initial;

			val && setForm((oldForm) => ({ ...oldForm, [SearchFilterId.Duration]: val }));
			op && setForm((oldForm) => ({ ...oldForm, operator: op as Operator }));
		}
	}, [initial]);

	// Events

	const onChangeDuration = (e: ChangeEvent<HTMLInputElement>) => {
		setForm((oldForm) => ({
			...oldForm,
			[SearchFilterId.Duration]: e.target.value,
		}));
	};

	return (
		<>
			<div className={clsx(className)}>
				<FormControl
					className="u-mb-24 c-form-control--label-hidden"
					errors={!isNil(errors.operator?.message) ? [errors.operator?.message] : undefined}
					id={labelKeys.operator}
					label={tHtml(
						'modules/visitor-space/components/duration-filter-form/duration-filter-form___operator'
					)}
				>
					<Controller
						control={control}
						name="operator"
						render={({ field }) => {
							// eslint-disable-next-line @typescript-eslint/no-unused-vars
							const { ref, ...rest } = field;
							return (
								<div className="u-px-32 u-px-20-md">
									<ReactSelect
										{...rest}
										isDisabled={disabled}
										components={{ IndicatorSeparator: () => null }}
										inputId={labelKeys.operator}
										onChange={(newValue) => {
											const value = (newValue as SingleValue<SelectOption>)?.value as Operator;

											if (value !== form.operator) {
												setForm({
													[SearchFilterId.Duration]: defaultValues.duration,
													operator: value,
												});
											}
										}}
										options={operators}
										value={getSelectValue(operators, field.value)}
									/>
								</div>
							);
						}}
					/>
				</FormControl>

				<FormControl
					className="c-form-control--label-hidden"
					errors={[
						<RedFormWarning
							error={errors[SearchFilterId.Duration]?.message}
							key="form-error--duration"
						/>,
					]}
					id={labelKeys[SearchFilterId.Duration]}
					label={tHtml(
						'modules/visitor-space/components/duration-filter-form/duration-filter-form___waarde'
					)}
				>
					<Controller
						control={control}
						name="duration"
						render={({ field }) => {
							// eslint-disable-next-line @typescript-eslint/no-unused-vars
							const { ref, ...refless } = field;

							return (
								<div className="u-py-32 u-px-32 u-px-20-md u-bg-platinum">
									{showRange ? (
										<DurationRangeInput
											{...refless}
											value={form.duration || `${defaultValue}${SEPARATOR}${defaultValue}`}
											onChange={onChangeDuration}
											placeholder={form[SearchFilterId.Duration]}
										/>
									) : (
										<DurationInput
											{...refless}
											value={form[SearchFilterId.Duration] || defaultValue}
											onChange={onChangeDuration}
											placeholder={form[SearchFilterId.Duration]}
										/>
									)}
								</div>
							);
						}}
					/>
				</FormControl>
			</div>

			{children({
				values: form,
				reset: () => {
					setForm(defaultValues);
					clearErrors();
				},
				handleSubmit,
			})}
		</>
	);
};

export default DurationFilterForm;
