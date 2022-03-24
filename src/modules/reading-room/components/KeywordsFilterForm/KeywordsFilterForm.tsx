import { yupResolver } from '@hookform/resolvers/yup';
import clsx from 'clsx';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryParams } from 'use-query-params';

import {
	KEYWORDS_FILTER_FORM_QUERY_PARAM_CONFIG,
	KEYWORDS_FILTER_FORM_SCHEMA,
} from './KeywordsFilterForm.const';
import { KeywordsFilterFormProps, KeywordsFilterFormState } from './KeywordsFilterForm.types';

const KeywordsFilterForm: FC<KeywordsFilterFormProps> = ({ children, className }) => {
	const [query] = useQueryParams(KEYWORDS_FILTER_FORM_QUERY_PARAM_CONFIG);

	const { getValues, reset } = useForm<KeywordsFilterFormState>({
		resolver: yupResolver(KEYWORDS_FILTER_FORM_SCHEMA()),
	});

	return (
		<>
			<div className={clsx(className, 'u-px-20 u-px-32:md')}>
				<div className="u-my-32">Keywords</div>
			</div>

			{children({ values: getValues(), reset })}
		</>
	);
};

export default KeywordsFilterForm;
