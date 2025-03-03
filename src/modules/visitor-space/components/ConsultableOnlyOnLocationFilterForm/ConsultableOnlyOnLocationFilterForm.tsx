import { IeObjectsSearchFilterField } from '@shared/types/ie-objects';
import CheckboxFilterForm from '@visitor-space/components/CheckboxFilterForm/CheckboxFilterForm';
import type { DefaultFilterFormProps, FilterValue } from '@visitor-space/types';
import { getInitialFilterValue } from '@visitor-space/utils/get-initial-filter-value';
import { type FC, useState } from 'react';
import { BooleanParam, useQueryParam } from 'use-query-params';

export const ConsultableOnlyOnLocationFilterForm: FC<DefaultFilterFormProps> = ({
	id,
	label,
	className,
	initialValue,
	onSubmit,
}) => {
	const [initialValueFromQueryParams] = useQueryParam(
		IeObjectsSearchFilterField.CONSULTABLE_ONLY_ON_LOCATION,
		BooleanParam
	);
	const [value] = useState<FilterValue>(
		getInitialFilterValue(id, initialValue, initialValueFromQueryParams)
	);

	const handleInputChange = (newValue: boolean) => {
		onSubmit({
			...value,
			val: newValue.toString(),
		});
	};

	return (
		<CheckboxFilterForm
			id={`consultable-only-on-location-filter-form--${id}`}
			value={value.val === 'true'}
			onChange={handleInputChange}
			label={label}
			className={className}
		/>
	);
};
