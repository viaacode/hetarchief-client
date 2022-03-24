import { yupResolver } from '@hookform/resolvers/yup';
import clsx from 'clsx';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryParams } from 'use-query-params';

import {
	CREATED_FILTER_FORM_QUERY_PARAM_CONFIG,
	CREATED_FILTER_FORM_SCHEMA,
} from './CreatedFilterForm.const';
import { CreatedFilterFormProps, CreatedFilterFormState } from './CreatedFilterForm.types';

const CreatedFilterForm: FC<CreatedFilterFormProps> = ({ children, className }) => {
	const [query] = useQueryParams(CREATED_FILTER_FORM_QUERY_PARAM_CONFIG);

	const { getValues, reset } = useForm<CreatedFilterFormState>({
		resolver: yupResolver(CREATED_FILTER_FORM_SCHEMA()),
	});

	return (
		<>
			<div className={clsx(className, 'u-px-20 u-px-32:md')}>
				<div className="u-my-32">Created</div>
			</div>

			{children({ values: getValues(), reset })}
		</>
	);
};

export default CreatedFilterForm;
