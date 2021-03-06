import { yupResolver } from '@hookform/resolvers/yup';
import { FormControl, ReactSelect, SelectOption } from '@meemoo/react-components';
import clsx from 'clsx';
import { ChangeEvent, FC, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { SingleValue } from 'react-select';
import { useQueryParams } from 'use-query-params';

import { SEPARATOR } from '@shared/const';
import { isRange, Operator } from '@shared/types';

import { MetadataProp } from '../../types';
import { getOperators } from '../../utils';
import { getSelectValue } from '../../utils/select';
import { DurationInput } from '../DurationInput';
import { defaultValue } from '../DurationInput/DurationInput';
import { DurationRangeInput } from '../DurationRangeInput';

import {
	DURATION_FILTER_FORM_QUERY_PARAM_CONFIG,
	DURATION_FILTER_FORM_SCHEMA,
} from './DurationFilterForm.const';
import { DurationFilterFormProps, DurationFilterFormState } from './DurationFilterForm.types';

const defaultValues = {
	operator: Operator.LessThanOrEqual,
	duration: undefined,
};

const DurationFilterForm: FC<DurationFilterFormProps> = ({ children, className }) => {
	const [query] = useQueryParams(DURATION_FILTER_FORM_QUERY_PARAM_CONFIG);

	const initial = query?.duration?.[0];

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

	const operators = useMemo(() => getOperators(MetadataProp.Duration), []);

	// Effects

	useEffect(() => {
		setValue('duration', form.duration);
		setValue('operator', form.operator);

		setShowRange(isRange(form.operator));
	}, [form, setValue]);

	useEffect(() => {
		if (initial) {
			const { val, op } = initial;

			val && setForm((f) => ({ ...f, duration: val }));
			op && setForm((f) => ({ ...f, operator: op as Operator }));
		}
	}, [initial]);

	// Events

	const onChangeDuration = (e: ChangeEvent<HTMLInputElement>) => {
		setForm({ ...form, duration: e.target.value });
	};

	return (
		<>
			<div className={clsx(className, 'u-px-20 u-px-32:md')}>
				<div className="u-mb-32">
					<FormControl className="u-mb-24" errors={[errors.operator?.message]}>
						<Controller
							name="operator"
							control={control}
							render={({ field }) => (
								<ReactSelect
									{...field}
									components={{ IndicatorSeparator: () => null }}
									options={operators}
									value={getSelectValue(operators, field.value)}
									onChange={(newValue) => {
										const value = (newValue as SingleValue<SelectOption>)
											?.value as Operator;

										if (value !== form.operator) {
											setForm({
												duration: defaultValues.duration,
												operator: value,
											});
										}
									}}
								/>
							)}
						/>
					</FormControl>

					<FormControl className="u-mb-24" errors={[errors.duration?.message]}>
						<Controller
							name="duration"
							control={control}
							render={({ field }) => {
								// eslint-disable-next-line @typescript-eslint/no-unused-vars
								const { ref, ...refless } = field;

								return showRange ? (
									<DurationRangeInput
										{...refless}
										value={
											form.duration ||
											`${defaultValue}${SEPARATOR}${defaultValue}`
										}
										onChange={onChangeDuration}
										placeholder={form.duration}
									/>
								) : (
									<DurationInput
										{...refless}
										value={form.duration || defaultValue}
										onChange={onChangeDuration}
										placeholder={form.duration}
									/>
								);
							}}
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

export default DurationFilterForm;
