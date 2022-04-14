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
import { isRange, Operator } from '@shared/types';

import { DateInput } from '../DateInput';
import { DateRangeInput } from '../DateRangeInput';

import {
	PUBLISHED_FILTER_FORM_QUERY_PARAM_CONFIG,
	PUBLISHED_FILTER_FORM_SCHEMA,
} from './PublishedFilterForm.const';
import { PublishedFilterFormProps, PublishedFilterFormState } from './PublishedFilterForm.types';

const defaultValues = {
	operator: Operator.GreaterThanOrEqual,
	published: undefined,
};

const PublishedFilterForm: FC<PublishedFilterFormProps> = ({ children, className }) => {
	const [query] = useQueryParams(PUBLISHED_FILTER_FORM_QUERY_PARAM_CONFIG);

	const initial = query?.published?.[0];

	const [showRange, setShowRange] = useState(isRange(initial?.op));
	const [form, setForm] = useState<PublishedFilterFormState>(defaultValues);

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
		}
	}, [initial]);

	// Events

	const onChangePublished = (published: string) => {
		setForm({ ...form, published });
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
												published: defaultValues.published,
											});
										}
									}}
								/>
							)}
						/>
					</FormControl>

					<FormControl className="u-mb-24" errors={[errors.published?.message]}>
						<Controller
							name="published"
							control={control}
							render={() =>
								showRange ? (
									<DateRangeInput
										onChange={(e) => onChangePublished(e.target.value)}
										value={form.published}
									/>
								) : (
									<DateInput
										onChange={(date) => {
											onChangePublished(
												(date || new Date()).valueOf().toString()
											);
										}}
										value={form.published}
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

export default PublishedFilterForm;
