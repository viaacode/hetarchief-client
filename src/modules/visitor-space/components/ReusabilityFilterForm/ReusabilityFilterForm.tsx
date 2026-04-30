import { CheckboxList } from '@meemoo/react-components';
import { FILTER_LABEL_VALUE_DELIMITER, SearchFilterId } from '@visitor-space/types';
import clsx from 'clsx';
import { compact, without } from 'lodash-es';
import { type FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryParams } from 'use-query-params';

import {
	REUSABILITY_FILTER_FORM_QUERY_PARAM_CONFIG,
	REUSABILITY_OPTIONS,
} from './ReusabilityFilterForm.const';
import type {
	ReusabilityFilterFormProps,
	ReusabilityFilterFormState,
} from './ReusabilityFilterForm.types';

const defaultValues: ReusabilityFilterFormState = {
	herbruikbaarheid: [],
};

const ReusabilityFilterForm: FC<ReusabilityFilterFormProps> = ({ children, className }) => {
	const [query] = useQueryParams(REUSABILITY_FILTER_FORM_QUERY_PARAM_CONFIG);

	// Applied values — strip label suffix to get just the key
	const appliedSelectedKeys = compact(
		(query[SearchFilterId.Reusability] || []).map(
			(value) => value?.split(FILTER_LABEL_VALUE_DELIMITER)?.[0]
		)
	);

	const [selectedKeys, setSelectedKeys] = useState<string[]>(() => appliedSelectedKeys);

	const { reset, handleSubmit } = useForm<ReusabilityFilterFormState>({
		defaultValues,
	});

	const options = REUSABILITY_OPTIONS();

	const keyToValue = (key: string): string => {
		const option = options.find((o) => o.key === key);
		return `${key}${FILTER_LABEL_VALUE_DELIMITER}${option?.label || key}`;
	};

	const onItemClick = (checked: boolean, value: unknown): void => {
		const newSelected = !checked
			? [...selectedKeys, value as string]
			: without(selectedKeys, value as string);
		setSelectedKeys(newSelected);
	};

	const checkboxOptions = options.map((option) => ({
		label: option.label,
		value: option.key,
		checked: selectedKeys.includes(option.key),
	}));

	return (
		<>
			<div className={clsx(className, 'u-px-32 u-px-20-md')}>
				<div className="c-filter-form__body">
					<CheckboxList
						items={checkboxOptions}
						onItemClick={onItemClick}
						id="reusability-filter-form-checkbox-list"
					/>
				</div>
			</div>

			{children({
				values: {
					herbruikbaarheid: selectedKeys.map(keyToValue),
				},
				reset: () => {
					reset();
					setSelectedKeys(defaultValues.herbruikbaarheid);
				},
				handleSubmit,
			})}
		</>
	);
};

export default ReusabilityFilterForm;
