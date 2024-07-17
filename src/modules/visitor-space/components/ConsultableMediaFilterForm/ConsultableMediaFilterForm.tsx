import { yupResolver } from '@hookform/resolvers/yup';
import { Checkbox, keysEnter, keysSpacebar, onKey } from '@meemoo/react-components';
import clsx from 'clsx';
import { type FC, useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryParams } from 'use-query-params';

import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { IeObjectsSearchFilterField } from '@shared/types/ie-objects';
import { SearchFilterId } from '@visitor-space/types';

import {
	CONSULTABLE_MEDIA_FILTER_FORM_QUERY_PARAM_CONFIG,
	CONSULTABLE_MEDIA_FILTER_FORM_SCHEMA,
} from './ConsultableMediaFilterForm.const';
import {
	type ConsultableMediaFilterFormProps,
	type ConsultableMediaFilterFormState,
} from './ConsultableMediaFilterForm.types';

const defaultValues = {
	[IeObjectsSearchFilterField.CONSULTABLE_MEDIA]: false,
};

const ConsultableMediaFilterForm: FC<ConsultableMediaFilterFormProps> = ({
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [setValue, isChecked]);

	const onClick = (value: boolean): void => {
		setIsChecked(!value);
	};

	return (
		<div className={clsx('u-color-white', className)}>
			<Checkbox
				variants={['light', 'reverse']}
				label={label}
				checked={isChecked}
				checkIcon={<Icon name={IconNamesLight.Check} />}
				onKeyDown={(e) => {
					onKey(e, [...keysEnter, ...keysSpacebar], () => {
						if (keysSpacebar.includes(e.key)) {
							e.preventDefault();
						}

						onClick(isChecked);
					});
				}}
				onClick={() => onClick(isChecked)}
			/>
		</div>
	);
};

export default ConsultableMediaFilterForm;
