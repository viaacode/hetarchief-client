import { yupResolver } from '@hookform/resolvers/yup';
import clsx from 'clsx';
import { compact, without } from 'lodash-es';
import { useTranslation } from 'next-i18next';
import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useQueryParams } from 'use-query-params';

import { SearchBar } from '@shared/components';
import { CheckboxList } from '@shared/components/CheckboxList';
import { selectMediaFilterOptions } from '@shared/store/media';

import {
	LANGUAGE_FILTER_FORM_QUERY_PARAM_CONFIG,
	LANGUAGE_FILTER_FORM_SCHEMA,
} from './LanguageFilterForm.const';
import { LanguageFilterFormProps, LanguageFilterFormState } from './LanguageFilterForm.types';

const defaultValues = {
	languages: [],
};

const LanguageFilterForm: FC<LanguageFilterFormProps> = ({ children, className }) => {
	const { t } = useTranslation();

	// State

	const [query] = useQueryParams(LANGUAGE_FILTER_FORM_QUERY_PARAM_CONFIG);
	const [search, setSearch] = useState<string>('');
	const [selection, setSelection] = useState<string[]>(() => compact(query.language || []));

	const { setValue, reset, handleSubmit } = useForm<LanguageFilterFormState>({
		resolver: yupResolver(LANGUAGE_FILTER_FORM_SCHEMA()),
		defaultValues,
	});

	const buckets = (
		useSelector(selectMediaFilterOptions)?.schema_in_language.buckets || []
	).filter((bucket) => bucket.key.toLowerCase().includes(search.toLowerCase()));

	// Effects

	useEffect(() => {
		setValue('languages', selection);
	}, [selection, setValue]);

	// Events

	const onItemClick = (add: boolean, value: string) => {
		const selected = add ? [...selection, value] : without(selection, value);
		setSelection(selected);
	};

	return (
		<>
			<div className={clsx(className, 'u-px-20 u-px-32:md')}>
				<SearchBar
					default={search}
					variants={['rounded', 'grey', 'icon--double', 'icon-clickable']}
					placeholder={t(
						'modules/visitor-space/components/language-filter-form/language-filter-form___zoek'
					)}
					onSearch={(value) => setSearch(value || '')}
				/>

				<div className="u-my-32">
					{buckets.length === 0 && (
						<p className="u-color-neutral u-text-center">
							{t(
								'modules/visitor-space/components/language-filter-form/language-filter-form___geen-talen-gevonden'
							)}
						</p>
					)}

					<CheckboxList
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
			</div>

			{children({
				values: { languages: selection },
				reset: () => {
					reset();
					setSelection(defaultValues.languages);
				},
				handleSubmit,
			})}
		</>
	);
};

export default LanguageFilterForm;
