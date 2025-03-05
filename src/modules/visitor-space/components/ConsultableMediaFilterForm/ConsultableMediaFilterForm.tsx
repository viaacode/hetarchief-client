import { IeObjectsSearchFilterField } from '@shared/types/ie-objects';
import CheckboxFilterForm from '@visitor-space/components/CheckboxFilterForm/CheckboxFilterForm';
import { AdvancedFilterArrayParam } from '@visitor-space/const/advanced-filter-array-param';
import type { DefaultFilterFormProps, FilterValue } from '@visitor-space/types';
import { type FC, useState } from 'react';
import { useQueryParam } from 'use-query-params';
import { initialFilterValues } from '../AdvancedFilterForm/AdvancedFilterForm.const';

export const ConsultableMediaFilterForm: FC<DefaultFilterFormProps> = ({
	id,
	className,
	onSubmit,
	initialValues,
	label,
}) => {
	const [initialValueFromQueryParams] = useQueryParam(
		IeObjectsSearchFilterField.CONSULTABLE_MEDIA,
		AdvancedFilterArrayParam
	);
	const [values] = useState<FilterValue[]>(
		initialValues || initialValueFromQueryParams || initialFilterValues(id)
	);

	const handleInputChange = (newValue: boolean | null) => {
		onSubmit([
			{
				...values[0],
				multiValue: [newValue ? 'true' : 'false'],
			},
		]);
	};

	return (
		<CheckboxFilterForm
			id={id}
			value={values[0].multiValue?.[0] === 'true'}
			onChange={handleInputChange}
			label={label}
			className={className}
		/>
	);
};
