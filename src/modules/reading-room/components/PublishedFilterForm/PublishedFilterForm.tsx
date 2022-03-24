import { yupResolver } from '@hookform/resolvers/yup';
import clsx from 'clsx';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryParams } from 'use-query-params';

import {
	PUBLISHED_FILTER_FORM_QUERY_PARAM_CONFIG,
	PUBLISHED_FILTER_FORM_SCHEMA,
} from './PublishedFilterForm.const';
import { PublishedFilterFormProps, PublishedFilterFormState } from './PublishedFilterForm.types';

const PublishedFilterForm: FC<PublishedFilterFormProps> = ({ children, className }) => {
	const [query] = useQueryParams(PUBLISHED_FILTER_FORM_QUERY_PARAM_CONFIG);

	const { getValues, reset } = useForm<PublishedFilterFormState>({
		resolver: yupResolver(PUBLISHED_FILTER_FORM_SCHEMA()),
	});

	return (
		<>
			<div className={clsx(className, 'u-px-20 u-px-32:md')}>
				<div className="u-my-32">Published</div>
			</div>

			{children({ values: getValues(), reset })}
		</>
	);
};

export default PublishedFilterForm;
