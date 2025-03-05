import { IeObjectsSearchFilterField } from '@shared/types/ie-objects';
import { initialFilterValues } from '@visitor-space/components/AdvancedFilterForm/AdvancedFilterForm.const';
import CheckboxFilterForm from '@visitor-space/components/CheckboxFilterForm/CheckboxFilterForm';
import { AdvancedFilterArrayParam } from '@visitor-space/const/advanced-filter-array-param';
import type { DefaultFilterFormProps, FilterValue } from '@visitor-space/types';
import { type FC, useState } from 'react';
import { useQueryParam } from 'use-query-params';

export const ConsultableOnlyOnLocationFilterForm: FC<DefaultFilterFormProps> = ({
	id,
	label,
	className,
	initialValues,
	onSubmit,
}) => {
	const [initialValueFromQueryParams] = useQueryParam(
		IeObjectsSearchFilterField.CONSULTABLE_ONLY_ON_LOCATION,
		AdvancedFilterArrayParam
	);
	const [values] = useState<FilterValue[]>(
		initialValues || initialValueFromQueryParams || initialFilterValues(id)
	);

	const handleInputChange = (newValue: boolean) => {
		onSubmit([
			{
				...values[0],
				multiValue: [newValue.toString()],
			},
		]);
	};

	return (
		<CheckboxFilterForm
			id={`consultable-only-on-location-filter-form--${id}`}
			value={values?.[0]?.multiValue?.[0] === 'true'}
			onChange={handleInputChange}
			label={label}
			className={className}
		/>
	);
};
