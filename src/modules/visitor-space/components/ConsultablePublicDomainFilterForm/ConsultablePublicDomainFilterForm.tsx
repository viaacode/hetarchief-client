import { type FC, useState } from 'react';
import { useQueryParam } from 'use-query-params';

import { IeObjectsSearchFilterField } from '@shared/types/ie-objects';
import { initialFilterValues } from '@visitor-space/components/AdvancedFilterForm/AdvancedFilterForm.const';
import CheckboxFilterForm from '@visitor-space/components/CheckboxFilterForm/CheckboxFilterForm';
import { AdvancedFilterArrayParam } from '@visitor-space/const/advanced-filter-array-param';
import type { DefaultFilterFormProps, FilterValue } from '@visitor-space/types';

export const ConsultablePublicDomainFilterForm: FC<DefaultFilterFormProps> = ({
	id,
	label,
	className,
	initialValues,
	onSubmit,
}) => {
	const [initialValueFromQueryParams] = useQueryParam(
		IeObjectsSearchFilterField.CONSULTABLE_PUBLIC_DOMAIN,
		AdvancedFilterArrayParam
	);
	const [values] = useState<FilterValue[]>(
		initialValues || initialValueFromQueryParams || initialFilterValues(id)
	);

	const handleChange = (newValue: boolean) => {
		onSubmit([
			{
				...values[0],
				multiValue: [newValue ? 'true' : 'false'],
			},
		]);
	};

	return (
		<CheckboxFilterForm
			id={`consultable-public-domain-filter-form--${id}`}
			value={values[0]?.multiValue?.[0] === 'true'}
			onChange={handleChange}
			label={label}
			className={className}
		/>
	);
};
