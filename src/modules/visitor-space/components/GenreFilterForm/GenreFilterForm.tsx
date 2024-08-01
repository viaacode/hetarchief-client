import { yupResolver } from '@hookform/resolvers/yup';
import { CheckboxList } from '@meemoo/react-components';
import clsx from 'clsx';
import { compact, noop, without } from 'lodash-es';
import { type FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useQueryParams } from 'use-query-params';

import { SearchBar } from '@shared/components/SearchBar';
import { tHtml, tText } from '@shared/helpers/translate';
import { selectIeObjectsFilterOptions } from '@shared/store/ie-objects';
import { visitorSpaceLabelKeys } from '@visitor-space/const/label-keys';
import { ElasticsearchFieldNames, SearchFilterId } from '@visitor-space/types';
import { sortFilterOptions } from '@visitor-space/utils/sort-filter-options';

import {
	GENRE_FILTER_FORM_QUERY_PARAM_CONFIG,
	GENRE_FILTER_FORM_SCHEMA,
} from './GenreFilterForm.const';
import { type GenreFilterFormProps, type GenreFilterFormState } from './GenreFilterForm.types';

const defaultValues = {
	genres: [],
};

const GenreFilterForm: FC<GenreFilterFormProps> = ({ children, className }) => {
	// State

	const [query] = useQueryParams(GENRE_FILTER_FORM_QUERY_PARAM_CONFIG);
	const [search, setSearch] = useState<string>('');

	// Contains the options that have already been applied and are present in the url
	const appliedSelectedGenres = compact(query.genre || []);

	// Contains the options the user currently has selected, but are not necessarily applied yet
	const [selectedGenres, setSelectedGenres] = useState<string[]>(appliedSelectedGenres);

	const { setValue, reset, handleSubmit } = useForm<GenreFilterFormState>({
		resolver: yupResolver(GENRE_FILTER_FORM_SCHEMA()),
		defaultValues,
	});

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
			checked: selectedGenres.includes(filterOption),
		})),
		appliedSelectedGenres
	);

	// Effects

	useEffect(() => {
		setValue('genres', selectedGenres);
	}, [selectedGenres, setValue]);

	// Events

	const onItemClick = (add: boolean, value: string) => {
		const selected = add ? [...selectedGenres, value] : without(selectedGenres, value);
		setSelectedGenres(selected);
	};

	return (
		<>
			<div className={clsx(className, 'u-px-20 u-px-32:md')}>
				<SearchBar
					id={`${visitorSpaceLabelKeys.filters.title}--${SearchFilterId.Genre}`}
					value={search}
					variants={['rounded', 'grey', 'icon--double', 'icon-clickable']}
					placeholder={tText(
						'modules/visitor-space/components/genre-filter-form/genre-filter-form___zoek'
					)}
					onChange={(value) => setSearch(value || '')}
					onSearch={noop}
				/>

				<div className="u-my-32">
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

			{children({
				values: { genres: selectedGenres },
				reset: () => {
					reset();
					setSelectedGenres(defaultValues.genres);
				},
				handleSubmit,
			})}
		</>
	);
};

export default GenreFilterForm;
