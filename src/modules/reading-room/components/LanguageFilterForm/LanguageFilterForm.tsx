import { yupResolver } from '@hookform/resolvers/yup';
import clsx from 'clsx';
import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useQueryParams } from 'use-query-params';

import { SearchBar } from '@shared/components';
import { CheckboxList } from '@shared/components/CheckboxList';
import { selectMediaResults } from '@shared/store/media';

import {
	LANGUAGE_FILTER_FORM_QUERY_PARAM_CONFIG,
	LANGUAGE_FILTER_FORM_SCHEMA,
} from './LanguageFilterForm.const';
import { LanguageFilterFormProps, LanguageFilterFormState } from './LanguageFilterForm.types';

const LanguageFilterForm: FC<LanguageFilterFormProps> = ({ children, className }) => {
	// State

	const [query] = useQueryParams(LANGUAGE_FILTER_FORM_QUERY_PARAM_CONFIG);
	const [search, setSearch] = useState<string>('');
	const [selection, setSelection] = useState<string[]>(() =>
		query.language && query.language !== null
			? (query.language.filter((item) => item !== null) as string[])
			: []
	);

	const { setValue, getValues, reset } = useForm<LanguageFilterFormState>({
		resolver: yupResolver(LANGUAGE_FILTER_FORM_SCHEMA()),
	});

	const buckets = useSelector(selectMediaResults)?.aggregations.schema_in_language.buckets || [];

	// Events

	const onItemClick = (add: boolean, value: string) => {
		const selected = add ? [...selection, value] : selection.filter((item) => item !== value);

		setValue('languages', selected);
		setSelection(selected);
	};

	return (
		<>
			<div className={clsx(className, 'u-px-20 u-px-32:md')}>
				<SearchBar
					searchValue={search}
					onSearch={setSearch}
					onClear={() => {
						setSearch('');
					}}
				/>

				<CheckboxList
					className="u-my-16"
					items={buckets
						.filter(
							(bucket) =>
								bucket.key.toLowerCase().indexOf(search.toLowerCase()) !== -1
						)
						.map((bucket) => ({
							...bucket,
							value: bucket.key,
							label: bucket.key,
							checked: selection.indexOf(bucket.key) !== -1,
						}))}
					onItemClick={(checked, value) => {
						onItemClick(!checked, value as string);
					}}
				/>
			</div>

			{children({ values: getValues(), reset })}
		</>
	);
};

export default LanguageFilterForm;
