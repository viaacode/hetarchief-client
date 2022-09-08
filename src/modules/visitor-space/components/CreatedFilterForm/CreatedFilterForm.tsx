import { yupResolver } from '@hookform/resolvers/yup';
import { FormControl, ReactSelect, SelectOption } from '@meemoo/react-components';
import clsx from 'clsx';
import { FC, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { SingleValue } from 'react-select';
import { useQueryParams } from 'use-query-params';

import useTranslation from '@shared/hooks/use-translation/use-translation';
import { isRange, Operator } from '@shared/types';

import { MetadataProp } from '../../types';
import { getOperators } from '../../utils';
import { getSelectValue } from '../../utils/select';
import { DateInput } from '../DateInput';
import { DateRangeInput } from '../DateRangeInput';

import {
	CREATED_FILTER_FORM_QUERY_PARAM_CONFIG,
	CREATED_FILTER_FORM_SCHEMA,
} from './CreatedFilterForm.const';
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
	const { t } = useTranslation();
	const [query] = useQueryParams(CREATED_FILTER_FORM_QUERY_PARAM_CONFIG);

	const initial = query?.created?.[0];

	const [showRange, setShowRange] = useState(isRange(initial?.op));
	const [form, setForm] = useState<CreatedFilterFormState>(defaultValues);

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

	const onChangeCreated = (created: string) => {
		setForm({ ...form, created });
	};

	return (
		<>
			<div className={clsx(className, 'u-px-20 u-px-32:md')}>
				<div className="u-mb-32">
					<FormControl
						className="u-mb-24 c-form-control--label-hidden"
						errors={[errors.operator?.message]}
						id={labelKeys.operator}
						label={t(
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
										const value = (newValue as SingleValue<SelectOption>)
											?.value as Operator;

										if (value !== form.operator) {
											setForm({
												operator: value,
												created: defaultValues.created,
											});
										}
									}}
									options={operators}
									value={getSelectValue(operators, field.value)}
								/>
							)}
						/>
					</FormControl>

					<FormControl
						className="u-mb-24 c-form-control--label-hidden"
						errors={[errors.created?.message]}
						id={labelKeys.created}
						label={t(
							'modules/visitor-space/components/created-filter-form/created-filter-form___waarde'
						)}
					>
						<Controller
							control={control}
							name="created"
							render={() =>
								showRange ? (
									<DateRangeInput
										disabled={disabled}
										id={labelKeys.created}
										onChange={(e) => onChangeCreated(e.target.value)}
										value={form.created}
									/>
								) : (
									<DateInput
										disabled={disabled}
										id={labelKeys.created}
										onChange={(date) => {
											onChangeCreated(
												(date || new Date()).valueOf().toString()
											);
										}}
										value={form.created}
									/>
								)
							}
						/>
					</FormControl>
				</div>
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

export default CreatedFilterForm;
