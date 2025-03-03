import { type FC, useState } from 'react';
import { BooleanParam, useQueryParam } from 'use-query-params';

import { IeObjectsSearchFilterField } from '@shared/types/ie-objects';
import CheckboxFilterForm from '@visitor-space/components/CheckboxFilterForm/CheckboxFilterForm';
import type { DefaultFilterFormProps, FilterValue } from '@visitor-space/types';
import { getInitialFilterValue } from '@visitor-space/utils/get-initial-filter-value';

export const ConsultablePublicDomainFilterForm: FC<DefaultFilterFormProps> = ({
	id,
	label,
	className,
	initialValue,
	onSubmit,
}) => {
	const [initialValueFromQueryParams] = useQueryParam(
		IeObjectsSearchFilterField.CONSULTABLE_PUBLIC_DOMAIN,
		BooleanParam
	);
	const [value] = useState<FilterValue>(
		getInitialFilterValue(id, initialValue, initialValueFromQueryParams)
	);

	const handleChange = (newValue: boolean) => {
		onSubmit({
			...value,
			multiValue: [newValue ? 'true' : 'false'],
		});
	};

	return (
		<CheckboxFilterForm
			id={`consultable-public-domain-filter-form--${id}`}
			value={value.multiValue?.[0] === 'true'}
			onChange={handleChange}
			label={label}
			className={className}
		/>
	);
};
