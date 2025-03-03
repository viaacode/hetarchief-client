import { IeObjectsSearchFilterField } from '@shared/types/ie-objects';
import CheckboxFilterForm from '@visitor-space/components/CheckboxFilterForm/CheckboxFilterForm';
import type { DefaultFilterFormProps, FilterValue } from '@visitor-space/types';
import { getInitialFilterValue } from '@visitor-space/utils/get-initial-filter-value';
import { type FC, useState } from 'react';
import { BooleanParam, useQueryParam } from 'use-query-params';

export const ConsultableMediaFilterForm: FC<DefaultFilterFormProps> = ({
	id,
	className,
	onSubmit,
	initialValue,
	label,
}) => {
	const [initialValueFromQueryParams] = useQueryParam(
		IeObjectsSearchFilterField.CONSULTABLE_MEDIA,
		BooleanParam
	);
	const [value] = useState<FilterValue>(
		getInitialFilterValue(id, initialValue, initialValueFromQueryParams)
	);

	const handleInputChange = (newValue: boolean | null) => {
		onSubmit({
			...value,
			multiValue: [newValue ? 'true' : 'false'],
		});
	};

	return (
		<CheckboxFilterForm
			id={id}
			value={value.multiValue?.[0] === 'true'}
			onChange={handleInputChange}
			label={label}
			className={className}
		/>
	);
};
