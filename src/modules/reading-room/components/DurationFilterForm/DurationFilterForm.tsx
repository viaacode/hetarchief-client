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
import { SEPARATOR } from '@shared/const';
import { Operator } from '@shared/types';

import { DurationInput } from '../DurationInput';
import { DurationRangeInput } from '../DurationRangeInput';

import {
	DURATION_FILTER_FORM_QUERY_PARAM_CONFIG,
	DURATION_FILTER_FORM_SCHEMA,
} from './DurationFilterForm.const';
import { DurationFilterFormProps, DurationFilterFormState } from './DurationFilterForm.types';

const DurationFilterForm: FC<DurationFilterFormProps> = ({ children, className }) => {
	const [query] = useQueryParams(DURATION_FILTER_FORM_QUERY_PARAM_CONFIG);
	const initial = query?.duration?.[0];

	const [showRange, setShowRange] = useState(initial && initial.op === Operator.Between);

	const { control, getValues, setValue, reset, formState } = useForm<DurationFilterFormState>({
		resolver: yupResolver(DURATION_FILTER_FORM_SCHEMA()),
	});

	const operators = useMemo(() => getOperators(MetadataProp.Duration), []);
	const errors = formState.errors;

	useEffect(() => {
		setValue('duration', initial?.val || '00:00:00');
		setValue('operator', (initial?.op as Operator) || Operator.LessThanOrEqual);
	}, []);

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

										if (value !== field.value) {
											setValue('operator', value);
											setShowRange(value === Operator.Between);
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
										value={field.value || `00:00:00${SEPARATOR}00:00:00`}
									/>
								) : (
									<DurationInput {...refless} value={field.value || '00:00:00'} />
								);
							}}
						/>
					</FormControl>
				</div>
			</div>

			{children({ values: getValues(), reset })}
		</>
	);
};

export default DurationFilterForm;
