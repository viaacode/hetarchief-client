import { yupResolver } from '@hookform/resolvers/yup';
import { type FC, useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryParams } from 'use-query-params';

import { IeObjectsSearchFilterField } from '@shared/types/ie-objects';
import CheckboxFilterForm from '@visitor-space/components/CheckboxFilterForm/CheckboxFilterForm';
import {
	type ConsultableOnlyOnLocationFilterFormProps,
	type ConsultableOnlyOnLocationFilterFormState,
} from '@visitor-space/components/ConsultableOnlyOnLocationFilterForm/ConsultableOnlyOnLocationFilterForm.types';
import { SearchFilterId } from '@visitor-space/types';

import {
	CONSULTABLE_ONLY_ON_LOCATION_FILTER_FORM_SCHEMA,
	REMOTE_FILTER_FORM_QUERY_PARAM_CONFIG,
} from './ConsultableOnlyOnLocationFilterForm.const';

const defaultValues = {
	[IeObjectsSearchFilterField.CONSULTABLE_ONLY_ON_LOCATION]: false,
};

export const ConsultableOnlyOnLocationFilterForm: FC<ConsultableOnlyOnLocationFilterFormProps> = ({
	id,
	label,
	onFormSubmit,
	className,
}) => {
	const [isInitialRender, setIsInitialRender] = useState(true);
	const [query] = useQueryParams(REMOTE_FILTER_FORM_QUERY_PARAM_CONFIG);
	const [isChecked, setIsChecked] = useState<boolean>(
		() => query[SearchFilterId.ConsultableOnlyOnLocation] || false
	);

	const { setValue, handleSubmit } = useForm<ConsultableOnlyOnLocationFilterFormState>({
		resolver: yupResolver(CONSULTABLE_ONLY_ON_LOCATION_FILTER_FORM_SCHEMA()),
		defaultValues,
	});

	const onFilterFormSubmit = useCallback(
		(id: SearchFilterId, values: unknown) => onFormSubmit(id, values),
		[onFormSubmit]
	);

	useEffect(() => {
		if (isInitialRender) {
			// Avoid this filter submitting results when loading the form for the first time
			setIsInitialRender(false);
			return;
		}
		setValue(IeObjectsSearchFilterField.CONSULTABLE_ONLY_ON_LOCATION, isChecked);

		handleSubmit(
			() =>
				onFilterFormSubmit(id, {
					[IeObjectsSearchFilterField.CONSULTABLE_ONLY_ON_LOCATION]: isChecked,
				}),
			(...args) => console.error(args)
		)();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [setValue, isChecked]);

	return (
		<CheckboxFilterForm
			value={isChecked}
			onChange={setIsChecked}
			label={label}
			className={className}
		/>
	);
};
