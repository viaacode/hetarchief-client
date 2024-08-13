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
	MEDIUM_FILTER_FORM_QUERY_PARAM_CONFIG,
	MEDIUM_FILTER_FORM_SCHEMA,
} from './MediumFilterForm.const';
import { type MediumFilterFormProps, type MediumFilterFormState } from './MediumFilterForm.types';

const defaultValues = {
	mediums: [],
};

const MediumFilterForm: FC<MediumFilterFormProps> = ({ children, className }) => {
	// State

	const [query] = useQueryParams(MEDIUM_FILTER_FORM_QUERY_PARAM_CONFIG);
	const [search, setSearch] = useState<string>('');

	// Contains the options that have already been applied and are present in the url
	const appliedSelectedMediums = compact(query.medium || []);

	// Contains the options the user currently has selected, but are not necessarily applied yet
	const [selectedMediums, setSelectedMediums] = useState<string[]>(appliedSelectedMediums);

	const { setValue, reset, handleSubmit } = useForm<MediumFilterFormState>({
		resolver: yupResolver(MEDIUM_FILTER_FORM_SCHEMA()),
		defaultValues,
	});

	const filterOptions: string[] =
		useSelector(selectIeObjectsFilterOptions)?.[ElasticsearchFieldNames.Medium]?.buckets?.map(
			(option) => option.key
		) || [];
	const filteredOptions = filterOptions.filter((filterOption) =>
		filterOption.toLowerCase().includes(search.toLowerCase())
	);

	// Make sure applied values are sorted at the top of the list
	// Options selected by the user should remain in their alphabetical order until the filter is applied
	// https://meemoo.atlassian.net/browse/ARC-1882
	const checkboxOptions = sortFilterOptions(
		filteredOptions.map((filterOption) => ({
			label: filterOption,
			value: filterOption,
			checked: selectedMediums.includes(filterOption),
		})),
		appliedSelectedMediums
	);

	// Effects

	useEffect(() => {
		setValue('mediums', selectedMediums);
	}, [selectedMediums, setValue]);

	// Events

	const onItemClick = (add: boolean, value: string) => {
		const selected = add ? [...selectedMediums, value] : without(selectedMediums, value);
		setSelectedMediums(selected);
	};

	return (
		<>
			<div className={clsx(className, 'u-px-20 u-px-32:md')}>
				<SearchBar
					id={`${visitorSpaceLabelKeys.filters.title}--${SearchFilterId.Medium}`}
					value={search}
					variants={['rounded', 'grey', 'icon--double', 'icon-clickable']}
					placeholder={tText(
						'modules/visitor-space/components/medium-filter-form/medium-filter-form___zoek'
					)}
					onChange={setSearch}
					onSearch={noop}
				/>

				<div className="u-my-32">
					{filterOptions.length === 0 && (
						<p className="u-color-neutral u-text-center">
							{tHtml(
								'modules/visitor-space/components/medium-filter-form/medium-filter-form___geen-analoge-dragers-gevonden'
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
				values: { mediums: selectedMediums },
				reset: () => {
					reset();
					setSelectedMediums(defaultValues.mediums);
					setSearch('');
				},
				handleSubmit,
			})}
		</>
	);
};

export default MediumFilterForm;
