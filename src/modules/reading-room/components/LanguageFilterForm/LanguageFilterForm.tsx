import { yupResolver } from '@hookform/resolvers/yup';
import clsx from 'clsx';
import { compact, without } from 'lodash-es';
import { useTranslation } from 'next-i18next';
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
	const { t } = useTranslation();

	// State

	const [query] = useQueryParams(LANGUAGE_FILTER_FORM_QUERY_PARAM_CONFIG);
	const [search, setSearch] = useState<string>('');
	const [selection, setSelection] = useState<string[]>(() => compact(query.language || []));

	const { setValue, getValues, reset } = useForm<LanguageFilterFormState>({
		resolver: yupResolver(LANGUAGE_FILTER_FORM_SCHEMA()),
	});

	const buckets = (
		useSelector(selectMediaResults)?.aggregations.schema_in_language.buckets || []
	).filter((bucket) => bucket.key.toLowerCase().includes(search.toLowerCase()));

	// Events

	const onItemClick = (add: boolean, value: string) => {
		const selected = add ? [...selection, value] : without(selection, value);

		setValue('languages', selected);
		setSelection(selected);
	};

	return (
		<>
			<div className={clsx(className, 'u-px-20 u-px-32:md')}>
				<SearchBar
					searchValue={search}
					onSearch={setSearch}
					onClear={() => setSearch('')}
				/>

				{buckets.length === 0 && (
					<p className="u-color-neutral u-text-center u-my-16">
						{t(
							'modules/reading-room/components/language-filter-form/language-filter-form___geen-talen-gevonden'
						)}
					</p>
				)}

				<CheckboxList
					className="u-my-16"
					items={buckets.map((bucket) => ({
						...bucket,
						value: bucket.key,
						label: bucket.key,
						checked: selection.includes(bucket.key),
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
