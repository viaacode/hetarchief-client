import { yupResolver } from '@hookform/resolvers/yup';
import { CheckboxList } from '@meemoo/react-components';
import clsx from 'clsx';
import { compact, noop, without } from 'lodash-es';
import { FC, useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useQueryParams } from 'use-query-params';

import { SearchBar } from '@shared/components';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { selectIeObjectsFilterOptions } from '@shared/store/ie-objects/ie-objects.select';
import { IeObjectsSearchFilterField } from '@shared/types';
import {
	LANGUAGE_FILTER_FORM_QUERY_PARAM_CONFIG,
	LANGUAGE_FILTER_FORM_SCHEMA,
	LanguageFilterFormProps,
	LanguageFilterFormState,
} from '@visitor-space/components';
import { LANGUAGES } from '@visitor-space/components/LanguageFilterForm/languages';
import { visitorSpaceLabelKeys } from '@visitor-space/const';
import { FILTER_LABEL_VALUE_DELIMITER, VisitorSpaceFilterId } from '@visitor-space/types';
import { sortFilterOptions } from '@visitor-space/utils/sort-filter-options';

const defaultValues = {
	languages: [],
};

const LanguageFilterForm: FC<LanguageFilterFormProps> = ({ children, className }) => {
	const { tHtml, tText } = useTranslation();

	// State

	const [query] = useQueryParams(LANGUAGE_FILTER_FORM_QUERY_PARAM_CONFIG);
	const [search, setSearch] = useState<string>('');

	// Contains the options that have already been applied and are present in the url
	const appliedSelectedLanguageCodes = compact(
		(query[VisitorSpaceFilterId.Language] || []).map(
			(languageCodeAndName) => languageCodeAndName?.split(FILTER_LABEL_VALUE_DELIMITER)?.[0]
		)
	);

	// Contains the options the user currently has selected, but are not necessarily applied yet
	const [selectedLanguageCodes, setSelectedLanguageCodes] = useState<string[]>(
		() => appliedSelectedLanguageCodes
	);

	const { setValue, reset, handleSubmit } = useForm<LanguageFilterFormState>({
		resolver: yupResolver(LANGUAGE_FILTER_FORM_SCHEMA()),
		defaultValues,
	});

	const filterOptions: string[] = useSelector(selectIeObjectsFilterOptions)?.[
		IeObjectsSearchFilterField.LANGUAGE
	];

	const filteredOptions = filterOptions.filter(
		(filterOption) =>
			filterOption.toLowerCase().includes(search.toLowerCase()) ||
			LANGUAGES.nl?.[filterOption]?.toLowerCase()?.includes(search.toLowerCase())
	);

	// Make sure applied values are sorted at the top of the list
	// Options selected by the user should remain in their alphabetical order until the filter is applied
	// https://meemoo.atlassian.net/browse/ARC-1882
	const checkboxOptions = sortFilterOptions(
		filteredOptions.map((filterOption) => ({
			label: LANGUAGES.nl[filterOption] || filterOption,
			value: filterOption,
			checked: selectedLanguageCodes.includes(filterOption),
		})),
		appliedSelectedLanguageCodes
	);

	const idToIdAndNameConcatinated = useCallback((id: string) => {
		return `${id}${FILTER_LABEL_VALUE_DELIMITER}${LANGUAGES.nl?.[id] || ''}`;
	}, []);

	// Effects

	useEffect(() => {
		const newValue = selectedLanguageCodes.map(idToIdAndNameConcatinated);
		setValue('languages', newValue);
	}, [selectedLanguageCodes, setValue, idToIdAndNameConcatinated]);

	// Events

	const onItemClick = (add: boolean, value: string) => {
		const selected = add
			? [...selectedLanguageCodes, value]
			: without(selectedLanguageCodes, value);
		setSelectedLanguageCodes(selected);
	};

	return (
		<>
			<div className={clsx(className, 'u-px-20 u-px-32:md')}>
				<SearchBar
					id={`${visitorSpaceLabelKeys.filters.title}--${VisitorSpaceFilterId.Language}`}
					value={search}
					variants={['rounded', 'grey', 'icon--double', 'icon-clickable']}
					placeholder={tText(
						'modules/visitor-space/components/language-filter-form/language-filter-form___zoek'
					)}
					onChange={(value) => setSearch(value || '')}
					onSearch={noop}
				/>

				<div className="u-my-32">
					{filterOptions.length === 0 && (
						<p className="u-color-neutral u-text-center">
							{tHtml(
								'modules/visitor-space/components/language-filter-form/language-filter-form___geen-talen-gevonden'
							)}
						</p>
					)}

					<CheckboxList
						items={checkboxOptions}
						onItemClick={(checked, value) => {
							onItemClick(!checked, value as string);
						}}
					/>
				</div>
			</div>

			{children({
				values: { languages: selectedLanguageCodes.map(idToIdAndNameConcatinated) },
				reset: () => {
					reset();
					setSelectedLanguageCodes(defaultValues.languages);
					setSearch('');
				},
				handleSubmit,
			})}
		</>
	);
};

export default LanguageFilterForm;
