import { yupResolver } from '@hookform/resolvers/yup';
import { type FC, useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryParams } from 'use-query-params';

import { IeObjectsSearchFilterField } from '@shared/types/ie-objects';
import CheckboxFilterForm from '@visitor-space/components/CheckboxFilterForm/CheckboxFilterForm';
import { SearchFilterId } from '@visitor-space/types';

import {
	CONSULTABLE_MEDIA_FILTER_FORM_QUERY_PARAM_CONFIG,
	CONSULTABLE_MEDIA_FILTER_FORM_SCHEMA,
} from './ConsultableMediaFilterForm.const';
import type {
	ConsultableMediaFilterFormProps,
	ConsultableMediaFilterFormState,
} from './ConsultableMediaFilterForm.types';

const defaultValues = {
	[IeObjectsSearchFilterField.CONSULTABLE_MEDIA]: false,
};

export const ConsultableMediaFilterForm: FC<ConsultableMediaFilterFormProps> = ({
	id,
	label,
	onFormSubmit,
	className,
}) => {
	const [isInitialRender, setIsInitialRender] = useState(true);
	const [query] = useQueryParams(CONSULTABLE_MEDIA_FILTER_FORM_QUERY_PARAM_CONFIG);
	const [isChecked, setIsChecked] = useState<boolean>(
		() => query[SearchFilterId.ConsultableMedia] || false
	);

	const { setValue, handleSubmit } = useForm<ConsultableMediaFilterFormState>({
		resolver: yupResolver(CONSULTABLE_MEDIA_FILTER_FORM_SCHEMA()),
		defaultValues,
	});

	const onFilterFormSubmit = useCallback(
		(id: SearchFilterId, values: unknown) => onFormSubmit(id, values),
		[onFormSubmit]
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: render loop
	useEffect(() => {
		if (isInitialRender) {
			// Avoid this filter submitting results when loading the form for the first time
			setIsInitialRender(false);
			return;
		}
		setValue(IeObjectsSearchFilterField.CONSULTABLE_MEDIA, isChecked);

		handleSubmit(
			() =>
				onFilterFormSubmit(id, {
					[IeObjectsSearchFilterField.CONSULTABLE_MEDIA]: isChecked,
				}),
			(...args) => console.error(args)
		)();
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
