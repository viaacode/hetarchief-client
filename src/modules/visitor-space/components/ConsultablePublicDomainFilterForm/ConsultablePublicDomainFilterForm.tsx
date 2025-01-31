import { yupResolver } from '@hookform/resolvers/yup';
import { type FC, useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryParams } from 'use-query-params';

import { IeObjectsSearchFilterField } from '@shared/types/ie-objects';
import CheckboxFilterForm from '@visitor-space/components/CheckboxFilterForm/CheckboxFilterForm';
import { SearchFilterId } from '@visitor-space/types';

import {
	CONSULTABLE_PUBLIC_DOMAIN_FILTER_FORM_QUERY_PARAM_CONFIG,
	CONSULTABLE_PUBLIC_DOMAIN_FILTER_FORM_SCHEMA,
} from './ConsultablePublicDomainFilterForm.const';
import type {
	ConsultablePublicDomainFilterFormProps,
	ConsultablePublicDomainFilterFormState,
} from './ConsultablePublicDomainFilterForm.types';

const defaultValues = {
	[IeObjectsSearchFilterField.CONSULTABLE_PUBLIC_DOMAIN]: false,
};

export const ConsultablePublicDomainFilterForm: FC<ConsultablePublicDomainFilterFormProps> = ({
	id,
	label,
	onFormSubmit,
	className,
}) => {
	const [isInitialRender, setIsInitialRender] = useState(true);
	const [query] = useQueryParams(CONSULTABLE_PUBLIC_DOMAIN_FILTER_FORM_QUERY_PARAM_CONFIG);
	const [isChecked, setIsChecked] = useState<boolean>(
		() => query[SearchFilterId.ConsultablePublicDomain] || false
	);

	const { setValue, handleSubmit } = useForm<ConsultablePublicDomainFilterFormState>({
		resolver: yupResolver(CONSULTABLE_PUBLIC_DOMAIN_FILTER_FORM_SCHEMA()),
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
		setValue(IeObjectsSearchFilterField.CONSULTABLE_PUBLIC_DOMAIN, isChecked);

		handleSubmit(
			() =>
				onFilterFormSubmit(id, {
					[IeObjectsSearchFilterField.CONSULTABLE_PUBLIC_DOMAIN]: isChecked,
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
