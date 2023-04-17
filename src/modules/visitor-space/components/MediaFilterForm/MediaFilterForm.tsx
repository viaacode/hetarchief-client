import { yupResolver } from '@hookform/resolvers/yup';
import { Checkbox, keysEnter, keysSpacebar, onKey } from '@meemoo/react-components';
import clsx from 'clsx';
import { FC, useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryParams } from 'use-query-params';

import { Icon, IconNamesLight } from '@shared/components';
import { VisitorSpaceFilterId } from '@visitor-space/types';

import {
	MEDIA_FILTER_FORM_QUERY_PARAM_CONFIG,
	MEDIA_FILTER_FORM_SCHEMA,
} from './MediaFilterForm.const';
import { MediaFilterFormProps, MediaFilterFormState } from './MediaFilterForm.types';

const defaultValues = {
	isConsultableMedia: false,
};

const MediaFilterForm: FC<MediaFilterFormProps> = ({ id, label, onFormSubmit, className }) => {
	const [query] = useQueryParams(MEDIA_FILTER_FORM_QUERY_PARAM_CONFIG);
	const [isChecked, setIsChecked] = useState<boolean>(
		() => query[VisitorSpaceFilterId.Media] || false
	);

	const { setValue, handleSubmit } = useForm<MediaFilterFormState>({
		resolver: yupResolver(MEDIA_FILTER_FORM_SCHEMA()),
		defaultValues,
	});

	const onFilterFormSubmit = useCallback(
		(id: string, values: unknown) => onFormSubmit(id, values),
		[onFormSubmit]
	);

	useEffect(() => {
		setValue('isConsultableMedia', isChecked);

		handleSubmit(
			() => onFilterFormSubmit(id, { isConsultableMedia: isChecked }),
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

export default MediaFilterForm;
