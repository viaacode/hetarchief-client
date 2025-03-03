import { type FC, useState } from 'react';
import { BooleanParam, useQueryParam } from 'use-query-params';

import { initialFilterValue } from '@visitor-space/components/AdvancedFilterForm/AdvancedFilterForm.const';
import CheckboxFilterForm from '@visitor-space/components/CheckboxFilterForm/CheckboxFilterForm';
import {
	type DefaultFilterFormProps,
	type FilterValue,
	Operator,
	SearchFilterId,
} from '@visitor-space/types';
import { isNil } from 'lodash-es';

export const ConsultableOnlyOnLocationFilterForm: FC<DefaultFilterFormProps> = ({
	id,
	label,
	className,
	initialValue,
	onSubmit,
}) => {
	const [initialValueFromQueryParams] = useQueryParam(
		SearchFilterId.ConsultableOnlyOnLocation,
		BooleanParam
	);
	const [value] = useState<FilterValue>(
		!isNil(initialValueFromQueryParams)
			? { prop: id, op: Operator.EQUALS, val: initialValueFromQueryParams ? 'true' : 'false' }
			: initialValue || initialFilterValue()
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
