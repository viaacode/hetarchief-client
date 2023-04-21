import { yupResolver } from '@hookform/resolvers/yup';
import { Checkbox, keysEnter, keysSpacebar, onKey } from '@meemoo/react-components';
import clsx from 'clsx';
import { FC, useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryParams } from 'use-query-params';

import { Icon, IconNamesLight } from '@shared/components';
import { IeObjectsSearchFilterField } from '@shared/types';
import {
	ConsultableOnlyOnLocationFilterFormProps,
	ConsultableOnlyOnLocationFilterFormState,
} from '@visitor-space/components';
import { VisitorSpaceFilterId } from '@visitor-space/types';

import {
	CONSULTABLE_ONLY_ON_LOCATION_FILTER_FORM_SCHEMA,
	REMOTE_FILTER_FORM_QUERY_PARAM_CONFIG,
} from './ConsultableOnlyOnLocationFilterForm.const';

const defaultValues = {
	[IeObjectsSearchFilterField.CONSULTABLE_ONLY_ON_LOCATION]: false,
};

const ConsultableOnlyOnLocationFilterForm: FC<ConsultableOnlyOnLocationFilterFormProps> = ({
	id,
	label,
	onFormSubmit,
	className,
}) => {
	const [query] = useQueryParams(REMOTE_FILTER_FORM_QUERY_PARAM_CONFIG);
	const [isChecked, setIsChecked] = useState<boolean>(
		() => query[VisitorSpaceFilterId.ConsultableOnlyOnLocation] || false
	);

	const { setValue, handleSubmit } = useForm<ConsultableOnlyOnLocationFilterFormState>({
		resolver: yupResolver(CONSULTABLE_ONLY_ON_LOCATION_FILTER_FORM_SCHEMA()),
		defaultValues,
	});

	const onFilterFormSubmit = useCallback(
		(id: string, values: unknown) => onFormSubmit(id, values),
		[onFormSubmit]
	);

	useEffect(() => {
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

export default ConsultableOnlyOnLocationFilterForm;
