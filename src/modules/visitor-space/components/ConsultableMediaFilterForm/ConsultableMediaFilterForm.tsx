import { initialFilterValue } from '@visitor-space/components/AdvancedFilterForm/AdvancedFilterForm.const';
import CheckboxFilterForm from '@visitor-space/components/CheckboxFilterForm/CheckboxFilterForm';
import {
	type DefaultFilterFormProps,
	type FilterValue,
	Operator,
	SearchFilterId,
} from '@visitor-space/types';
import { type FC, useState } from 'react';
import { StringParam, useQueryParam } from 'use-query-params';

export const ConsultableMediaFilterForm: FC<DefaultFilterFormProps> = ({
	id,
	className,
	onSubmit,
	initialValue,
	label,
}) => {
	const [initialValueFromQueryParams] = useQueryParam(SearchFilterId.ConsultableMedia, StringParam);
	const [value] = useState<FilterValue>(
		initialValueFromQueryParams
			? {
					prop: SearchFilterId.ConsultableMedia,
					op: Operator.EQUALS,
					val: initialValueFromQueryParams,
				}
			: initialValue || initialFilterValue()
	);

	const handleInputChange = (newValue: boolean | null) => {
		onSubmit({
			...value,
			val: newValue ? 'true' : 'false',
		});
	};

	return (
		<CheckboxFilterForm
			id={id}
			value={value.val === 'true'}
			onChange={handleInputChange}
			label={label}
			className={className}
		/>
	);
};
