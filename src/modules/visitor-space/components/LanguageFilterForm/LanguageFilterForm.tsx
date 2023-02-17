import { yupResolver } from '@hookform/resolvers/yup';
import clsx from 'clsx';
import { compact, without } from 'lodash-es';
import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useQueryParams } from 'use-query-params';

import { SearchBar } from '@shared/components';
import { CheckboxList } from '@shared/components/CheckboxList';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { selectIeObjectsFilterOptions } from '@shared/store/ie-objects';
import { visitorSpaceLabelKeys } from '@visitor-space/const';
import { VisitorSpaceFilterId } from '@visitor-space/types';

import {
	LANGUAGE_FILTER_FORM_QUERY_PARAM_CONFIG,
	LANGUAGE_FILTER_FORM_SCHEMA,
} from './LanguageFilterForm.const';
import { LanguageFilterFormProps, LanguageFilterFormState } from './LanguageFilterForm.types';

const defaultValues = {
	languages: [],
};

const LanguageFilterForm: FC<LanguageFilterFormProps> = ({ children, className }) => {
	const { tHtml, tText } = useTranslation();

	// State

	const [query] = useQueryParams(LANGUAGE_FILTER_FORM_QUERY_PARAM_CONFIG);
	const [search, setSearch] = useState<string>('');
	const [selection, setSelection] = useState<string[]>(() => compact(query.language || []));
	const [shouldReset, setShouldReset] = useState<boolean>(false);

	const { setValue, reset, handleSubmit } = useForm<LanguageFilterFormState>({
		resolver: yupResolver(LANGUAGE_FILTER_FORM_SCHEMA()),
		defaultValues,
	});

	const buckets = (
		useSelector(selectIeObjectsFilterOptions)?.schema_in_language.buckets || []
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
					id={`${visitorSpaceLabelKeys.filters.title}--${VisitorSpaceFilterId.Language}`}
					default={search}
					variants={['rounded', 'grey', 'icon--double', 'icon-clickable']}
					placeholder={tText(
						'modules/visitor-space/components/language-filter-form/language-filter-form___zoek'
					)}
					onSearch={(value) => setSearch(value || '')}
					shouldReset={shouldReset}
					onResetFinished={() => setShouldReset(false)}
				/>

				<div className="u-my-32">
					{buckets.length === 0 && (
						<p className="u-color-neutral u-text-center">
							{tHtml(
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
					setSearch('');
					setShouldReset(true);
				},
				handleSubmit,
			})}
		</>
	);
};

export default LanguageFilterForm;
