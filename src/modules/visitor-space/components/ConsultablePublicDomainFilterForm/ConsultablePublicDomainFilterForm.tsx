import { type FC, useState } from 'react';
import { BooleanParam, useQueryParam } from 'use-query-params';

import CheckboxFilterForm from '@visitor-space/components/CheckboxFilterForm/CheckboxFilterForm';
import {
	type DefaultFilterFormProps,
	type FilterValue,
	Operator,
	SearchFilterId,
} from '@visitor-space/types';

import { initialFilterValue } from '@visitor-space/components/AdvancedFilterForm/AdvancedFilterForm.const';
import { isNil } from 'lodash-es';

export const ConsultablePublicDomainFilterForm: FC<DefaultFilterFormProps> = ({
	id,
	label,
	className,
	initialValue,
	onSubmit,
}) => {
	const [initialValueFromQueryParams] = useQueryParam(
		SearchFilterId.ConsultablePublicDomain,
		BooleanParam
	);
	const [value] = useState<FilterValue>(
		!isNil(initialValueFromQueryParams)
			? { prop: id, op: Operator.EQUALS, val: initialValueFromQueryParams ? 'true' : 'false' }
			: initialValue || initialFilterValue(Operator.EQUALS)
	);

	const handleChange = (newValue: boolean) => {
		onSubmit({
			...value,
			val: newValue ? 'true' : 'false',
		});
	};

	return (
		<CheckboxFilterForm
			id={`consultable-public-domain-filter-form--${id}`}
			value={value.val === 'true'}
			onChange={handleChange}
			label={label}
			className={className}
		/>
	);
};
