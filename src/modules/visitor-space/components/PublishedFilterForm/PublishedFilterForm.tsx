import { yupResolver } from '@hookform/resolvers/yup';
import { FormControl, ReactSelect, SelectOption } from '@meemoo/react-components';
import clsx from 'clsx';
import { useTranslation } from 'next-i18next';
import { FC, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { SingleValue } from 'react-select';
import { useQueryParams } from 'use-query-params';

import { isRange, Operator } from '@shared/types';

import { MetadataProp } from '../../types';
import { getOperators } from '../../utils';
import { getSelectValue } from '../../utils/select';
import { DateInput } from '../DateInput';
import { DateRangeInput } from '../DateRangeInput';

import {
	PUBLISHED_FILTER_FORM_QUERY_PARAM_CONFIG,
	PUBLISHED_FILTER_FORM_SCHEMA,
} from './PublishedFilterForm.const';
import { PublishedFilterFormProps, PublishedFilterFormState } from './PublishedFilterForm.types';

const labelKeys: Record<keyof PublishedFilterFormState, string> = {
	operator: 'PublishedFilterForm__operator',
	published: 'PublishedFilterForm__published',
};

const defaultValues: PublishedFilterFormState = {
	operator: Operator.GreaterThanOrEqual,
	published: undefined,
};

const PublishedFilterForm: FC<PublishedFilterFormProps> = ({ children, className }) => {
	const [t] = useTranslation();
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

			setShowRange(isRange(op)); // Not covered by other effect in time
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
					<FormControl
						className="u-mb-24 c-form-control--label-hidden"
						errors={[errors.operator?.message]}
						id={labelKeys.operator}
						label={t(
							'modules/visitor-space/components/published-filter-form/published-filter-form___operator'
						)}
					>
						<Controller
							control={control}
							name="operator"
							render={({ field }) => (
								<ReactSelect
									{...field}
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

					<FormControl
						className="u-mb-24 c-form-control--label-hidden"
						errors={[errors.published?.message]}
						id={labelKeys.published}
						label={t(
							'modules/visitor-space/components/published-filter-form/published-filter-form___waarde'
						)}
					>
						<Controller
							control={control}
							name="published"
							render={() =>
								showRange ? (
									<DateRangeInput
										id={labelKeys.published}
										onChange={(e) => onChangePublished(e.target.value)}
										value={form.published}
									/>
								) : (
									<DateInput
										id={labelKeys.published}
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
