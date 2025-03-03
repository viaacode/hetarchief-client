import { CheckboxList } from '@meemoo/react-components';
import clsx from 'clsx';
import { compact, noop, without } from 'lodash-es';
import { type FC, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { ArrayParam, useQueryParam } from 'use-query-params';

import { SearchBar } from '@shared/components/SearchBar';
import { tHtml, tText } from '@shared/helpers/translate';
import { selectIeObjectsFilterOptions } from '@shared/store/ie-objects';
import { IeObjectsSearchFilterField } from '@shared/types/ie-objects';
import { initialFilterValue } from '@visitor-space/components/AdvancedFilterForm/AdvancedFilterForm.const';
import FilterFormButtons from '@visitor-space/components/FilterMenu/FilterFormButtons/FilterFormButtons';
import {
	LANGUAGES,
	type LanguageCode,
} from '@visitor-space/components/LanguageFilterForm/languages';
import { visitorSpaceLabelKeys } from '@visitor-space/const/label-keys';
import {
	type DefaultFilterFormProps,
	ElasticsearchFieldNames,
	FILTER_LABEL_VALUE_DELIMITER,
	type FilterValue,
} from '@visitor-space/types';
import { getInitialFilterValue } from '@visitor-space/utils/get-initial-filter-value';
import { sortFilterOptions } from '@visitor-space/utils/sort-filter-options';

const LanguageFilterForm: FC<DefaultFilterFormProps> = ({
	className,
	id,
	initialValues,
	onSubmit,
	onReset,
}) => {
	const [initialValueFromQueryParams] = useQueryParam(
		IeObjectsSearchFilterField.LANGUAGE,
		ArrayParam
	);
	const [value, setValue] = useState<FilterValue>(
		getInitialFilterValue(id, initialValues?.[0], initialValueFromQueryParams)
	);
	const [search, setSearch] = useState<string>('');

	// Contains the options that have already been applied and are present in the url
	const appliedSelectedLanguageCodes = compact(
		(initialValueFromQueryParams || []).map(
			(languageCodeAndName) => languageCodeAndName?.split(FILTER_LABEL_VALUE_DELIMITER)?.[0]
		)
	);

	// Contains the options the user currently has selected, but are not necessarily applied yet
	const [selectedLanguageCodes, setSelectedLanguageCodes] = useState<string[]>(
		() => appliedSelectedLanguageCodes
	);

	const filterOptions: string[] =
		useSelector(selectIeObjectsFilterOptions)?.[ElasticsearchFieldNames.Language]?.buckets?.map(
			(bucket) => bucket.key
		) || [];

	const filteredOptions = filterOptions.filter(
		(filterOption) =>
			filterOption.toLowerCase().includes(search.toLowerCase()) ||
			LANGUAGES.nl?.[filterOption as LanguageCode]?.toLowerCase()?.includes(search.toLowerCase())
	);

	// Make sure applied values are sorted at the top of the list
	// Options selected by the user should remain in their alphabetical order until the filter is applied
	// https://meemoo.atlassian.net/browse/ARC-1882
	const checkboxOptions = sortFilterOptions(
		filteredOptions.map((filterOption) => ({
			label: LANGUAGES.nl[filterOption as LanguageCode] || filterOption,
			value: filterOption,
			checked: selectedLanguageCodes.includes(filterOption),
		})),
		appliedSelectedLanguageCodes
	);

	const idToIdAndNameConcatinated = useCallback((id: string) => {
		return `${id}${FILTER_LABEL_VALUE_DELIMITER}${LANGUAGES.nl?.[id as LanguageCode] || ''}`;
	}, []);

	// Events

	const onItemClick = (add: boolean, value: string) => {
		const selected = add
			? [...selectedLanguageCodes, value]
			: without(selectedLanguageCodes, value);
		setSelectedLanguageCodes(selected);
	};

	const handleSubmit = () => {
		onSubmit([
			{
				...value,
				multiValue: (value.multiValue || []).map(idToIdAndNameConcatinated),
			},
		]);
	};

	const handleReset = () => {
		setValue(initialFilterValue());
		onReset();
	};

	return (
		<>
			<div className={clsx(className, 'u-px-20 u-px-32-md')}>
				<SearchBar
					id={`${visitorSpaceLabelKeys.filters.title}--${IeObjectsSearchFilterField.LANGUAGE}`}
					value={search}
					variants={['rounded', 'grey', 'icon--double', 'icon-clickable']}
					placeholder={tText(
						'modules/visitor-space/components/language-filter-form/language-filter-form___zoek'
					)}
					onChange={(value) => setSearch(value || '')}
					onSearch={noop}
				/>

				<div className="c-filter-form__body--scrollable">
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

			<FilterFormButtons onSubmit={handleSubmit} onReset={handleReset} />
		</>
	);
};

export default LanguageFilterForm;
