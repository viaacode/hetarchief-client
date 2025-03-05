import { CheckboxList } from '@meemoo/react-components';
import clsx from 'clsx';
import { compact, noop, without } from 'lodash-es';
import { type FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { useQueryParam } from 'use-query-params';

import { SearchBar } from '@shared/components/SearchBar';
import { tHtml, tText } from '@shared/helpers/translate';
import { selectIeObjectsFilterOptions } from '@shared/store/ie-objects';
import { visitorSpaceLabelKeys } from '@visitor-space/const/label-keys';
import {
	type DefaultFilterFormProps,
	ElasticsearchFieldNames,
	type FilterValue,
} from '@visitor-space/types';
import { sortFilterOptions } from '@visitor-space/utils/sort-filter-options';

import { IeObjectsSearchFilterField } from '@shared/types/ie-objects';
import { initialFilterValues } from '@visitor-space/components/AdvancedFilterForm/AdvancedFilterForm.const';
import FilterFormButtons from '@visitor-space/components/FilterMenu/FilterFormButtons/FilterFormButtons';
import { AdvancedFilterArrayParam } from '@visitor-space/const/advanced-filter-array-param';

const GenreFilterForm: FC<DefaultFilterFormProps> = ({
	className,
	id,
	initialValues,
	onSubmit,
	onReset,
}) => {
	const [initialValueFromQueryParams] = useQueryParam(
		IeObjectsSearchFilterField.GENRE,
		AdvancedFilterArrayParam
	);
	const [values, setValues] = useState<FilterValue[]>(
		initialFilterValues(id, initialValues, initialValueFromQueryParams)
	);
	const [search, setSearch] = useState<string>('');

	// Contains the options that have already been applied and are present in the url
	const appliedSelectedGenres = compact(values[0]?.multiValue || []);

	const filterOptions: string[] =
		useSelector(selectIeObjectsFilterOptions)?.[ElasticsearchFieldNames.Genre]?.buckets?.map(
			(filterOption) => filterOption.key
		) || [];

	const filteredOptions: string[] = filterOptions.filter((filterOption) =>
		filterOption.toLowerCase().includes(search.toLowerCase())
	);

	// Make sure applied values are sorted at the top of the list
	// Options selected by the user should remain in their alphabetical order until the filter is applied
	// https://meemoo.atlassian.net/browse/ARC-1882
	const checkboxOptions = sortFilterOptions(
		filteredOptions.map((filterOption) => ({
			label: filterOption,
			value: filterOption,
			checked: appliedSelectedGenres.includes(filterOption),
		})),
		appliedSelectedGenres
	);

	// Events

	const onItemClick = (add: boolean, newValue: string) => {
		const selected = add
			? [...appliedSelectedGenres, newValue]
			: without(appliedSelectedGenres, newValue);
		setValues([
			{
				...values[0],
				multiValue: selected,
			},
		]);
	};

	const handleSubmit = () => {
		onSubmit(values);
	};

	const handleReset = () => {
		setValues(initialFilterValues(id));
		onReset();
	};

	return (
		<>
			<div className={clsx(className, 'u-px-20 u-px-32-md')}>
				<SearchBar
					id={`${visitorSpaceLabelKeys.filters.title}--${IeObjectsSearchFilterField.GENRE}`}
					value={search}
					variants={['rounded', 'grey', 'icon--double', 'icon-clickable']}
					placeholder={tText(
						'modules/visitor-space/components/genre-filter-form/genre-filter-form___zoek'
					)}
					onChange={(value) => setSearch(value || '')}
					onSearch={noop}
				/>

				<div className="c-filter-form__body--scrollable">
					{filterOptions.length === 0 && (
						<p className="u-color-neutral u-text-center u-my-16">
							{tHtml(
								'modules/visitor-space/components/genre-filter-form/genre-filter-form___geen-genres-gevonden'
							)}
						</p>
					)}

					<CheckboxList
						className="u-my-16"
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

export default GenreFilterForm;
