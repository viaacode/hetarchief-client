import { yupResolver } from '@hookform/resolvers/yup';
import { CheckboxList } from '@meemoo/react-components';
import clsx from 'clsx';
import { compact, keyBy, mapValues, noop, without } from 'lodash-es';
import { type FC, useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useQueryParams } from 'use-query-params';

import { SearchBar } from '@shared/components/SearchBar';
import { tHtml, tText } from '@shared/helpers/translate';
import { selectIeObjectsFilterOptions } from '@shared/store/ie-objects/ie-objects.select';
import type {
	MaintainerFilterFormProps,
	MaintainerFilterFormState,
} from '@visitor-space/components/MaintainerFilterForm/MaintainerFilterForm.types';
import { visitorSpaceLabelKeys } from '@visitor-space/const/label-keys';
import { useGetContentPartners } from '@visitor-space/hooks/get-content-partner';
import {
	ElasticsearchFieldNames,
	FILTER_LABEL_VALUE_DELIMITER,
	SearchFilterId,
} from '@visitor-space/types';
import { sortFilterOptions } from '@visitor-space/utils/sort-filter-options';

import {
	MAINTAINER_FILTER_FORM_QUERY_PARAM_CONFIG,
	MAINTAINER_FILTER_FORM_SCHEMA,
} from './MaintainerFilterForm.const';

const defaultValues = {
	maintainers: [],
};

const MaintainerFilterForm: FC<MaintainerFilterFormProps> = ({ children, className }) => {
	const [query] = useQueryParams(MAINTAINER_FILTER_FORM_QUERY_PARAM_CONFIG);
	const [search, setSearch] = useState<string>('');

	// Contains the filters that have already been applied and are present in the url
	const appliedSelectedMaintainerIds = compact(
		(query[SearchFilterId.Maintainers] || []).map(
			(maintainerIdAndName) => maintainerIdAndName?.split(FILTER_LABEL_VALUE_DELIMITER)?.[0]
		)
	);

	// Contains the options that have already been applied and are present in the url
	const [selectedMaintainerIds, setSelectedMaintainerIds] = useState<string[]>(
		() => appliedSelectedMaintainerIds
	);

	const { setValue, reset, handleSubmit } = useForm<MaintainerFilterFormState>({
		resolver: yupResolver(MAINTAINER_FILTER_FORM_SCHEMA()),
		defaultValues,
	});

	// Get all maintainer names
	const { data: maintainers } = useGetContentPartners({});
	const maintainerNames = mapValues(
		keyBy(maintainers || [], (m) => m.id),
		(v) => v.name
	);

	const filterOptions: { id: string; name: string }[] =
		useSelector(selectIeObjectsFilterOptions)?.[ElasticsearchFieldNames.Maintainer]?.buckets?.map(
			(bucket) => ({
				id: bucket.key,
				name: maintainerNames?.[bucket.key] || bucket.key,
			})
		) || [];

	const filteredBuckets = filterOptions.filter((filterOption) =>
		filterOption.name.toLowerCase().includes(search.toLowerCase())
	);

	// Make sure applied values are sorted at the top of the list
	// Options selected by the user should remain in their alphabetical order until the filter is applied
	// https://meemoo.atlassian.net/browse/ARC-1882
	const checkboxOptions = sortFilterOptions(
		filteredBuckets.map((filterOption) => {
			return {
				label: filterOption.name,
				value: filterOption.id,
				checked: selectedMaintainerIds.includes(filterOption.id),
			};
		}),
		appliedSelectedMaintainerIds
	);

	const idToIdAndNameConcatinated = useCallback(
		(id: string) => {
			if (!maintainers) {
				return '';
			}
			return `${id}${FILTER_LABEL_VALUE_DELIMITER}${maintainerNames?.[id] || ''}`;
		},
		[maintainers, maintainerNames]
	);

	useEffect(() => {
		setValue('maintainers', selectedMaintainerIds.map(idToIdAndNameConcatinated));
	}, [selectedMaintainerIds, setValue, idToIdAndNameConcatinated]);

	const onItemClick = (checked: boolean, value: unknown): void => {
		const newSelectedMaintainers = !checked
			? [...selectedMaintainerIds, value as string]
			: without(selectedMaintainerIds, value as string);
		setSelectedMaintainerIds(newSelectedMaintainers);
	};

	return (
		<>
			<div className={clsx(className, 'u-px-32 u-px-20-md')}>
				<SearchBar
					id={`${visitorSpaceLabelKeys.filters.title}--${SearchFilterId.Maintainers}`}
					value={search}
					variants={['rounded', 'grey', 'icon--double', 'icon-clickable']}
					placeholder={tText(
						'modules/visitor-space/components/maintainers-filter-form/maintainers-filter-form___zoek'
					)}
					onChange={setSearch}
					onSearch={noop}
				/>

				<div className="c-filter-form__body--scrollable">
					{filteredBuckets.length === 0 && (
						<p className="u-color-neutral u-text-center">
							{tHtml(
								'modules/visitor-space/components/maintainers-filter-form/maintainers-filter-form___geen-aanbieders-gevonden'
							)}
						</p>
					)}

					{maintainers && <CheckboxList items={checkboxOptions} onItemClick={onItemClick} />}
				</div>
			</div>

			{children({
				values: {
					maintainers: selectedMaintainerIds.map(idToIdAndNameConcatinated),
				},
				reset: () => {
					reset();
					setSelectedMaintainerIds(defaultValues.maintainers);
					setSearch('');
				},
				handleSubmit,
			})}
		</>
	);
};

export default MaintainerFilterForm;
