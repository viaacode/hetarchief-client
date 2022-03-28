import { yupResolver } from '@hookform/resolvers/yup';
import { FormControl, ReactSelect, SelectOption } from '@meemoo/react-components';
import clsx from 'clsx';
import { FC, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { SingleValue } from 'react-select';
import { useQueryParams } from 'use-query-params';

import { MetadataProp } from '@reading-room/types';
import { getOperators } from '@reading-room/utils';
import { getSelectValue } from '@reading-room/utils/select';
import { Operator } from '@shared/types';

import { DateInput } from '../DateInput';
import { DateRangeInput } from '../DateRangeInput';

import {
	CREATED_FILTER_FORM_QUERY_PARAM_CONFIG,
	CREATED_FILTER_FORM_SCHEMA,
} from './CreatedFilterForm.const';
import { CreatedFilterFormProps, CreatedFilterFormState } from './CreatedFilterForm.types';

const CreatedFilterForm: FC<CreatedFilterFormProps> = ({ children, className }) => {
	const [query] = useQueryParams(CREATED_FILTER_FORM_QUERY_PARAM_CONFIG);

	// Computed

	const operators = useMemo(() => getOperators(MetadataProp.CreatedAt), []);

	const initial = query?.created?.[0];
	const initialCreated = useMemo(() => initial?.val || '', [initial]);

	// State

	const [showRange, setShowRange] = useState(initial && initial.op === Operator.Between);

	const [form, setForm] = useState<CreatedFilterFormState>({
		operator: (initial?.op as Operator) || Operator.GreaterThanOrEqual,
		created: initialCreated,
	});
	const {
		control,
		reset,
		formState: { errors },
		setValue,
	} = useForm<CreatedFilterFormState>({
		resolver: yupResolver(CREATED_FILTER_FORM_SCHEMA()),
	});

	// Effects

	useEffect(() => {
		setValue('created', form.created);
		setValue('operator', form.operator);
	}, [form, setValue]);

	// Events

	const onChangeCreated = (created: string) => {
		setForm({ ...form, created });
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
												operator: value,
												created: '',
											});
											setShowRange(value === Operator.Between);
										}
									}}
								/>
							)}
						/>
					</FormControl>

					<FormControl className="u-mb-24" errors={[errors.created?.message]}>
						<Controller
							name="created"
							control={control}
							render={() =>
								showRange ? (
									<DateRangeInput
										onChange={(e) => onChangeCreated(e.target.value)}
										value={form.created}
									/>
								) : (
									<DateInput
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

			{children({ values: form, reset })}
		</>
	);
};

export default CreatedFilterForm;
