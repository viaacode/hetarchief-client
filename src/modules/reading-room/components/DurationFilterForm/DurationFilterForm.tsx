import { yupResolver } from '@hookform/resolvers/yup';
import clsx from 'clsx';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryParams } from 'use-query-params';

import {
	DURATION_FILTER_FORM_QUERY_PARAM_CONFIG,
	DURATION_FILTER_FORM_SCHEMA,
} from './DurationFilterForm.const';
import { DurationFilterFormProps, DurationFilterFormState } from './DurationFilterForm.types';

const DurationFilterForm: FC<DurationFilterFormProps> = ({ children, className }) => {
	const [query] = useQueryParams(DURATION_FILTER_FORM_QUERY_PARAM_CONFIG);

	const { getValues, reset } = useForm<DurationFilterFormState>({
		resolver: yupResolver(DURATION_FILTER_FORM_SCHEMA()),
	});

	return (
		<>
			<div className={clsx(className, 'u-px-20 u-px-32:md')}>
				<div className="u-my-32">Duration</div>
			</div>

			{children({ values: getValues(), reset })}
		</>
	);
};

export default DurationFilterForm;
