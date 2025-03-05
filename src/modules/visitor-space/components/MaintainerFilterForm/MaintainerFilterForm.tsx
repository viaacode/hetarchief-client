import { CheckboxList } from '@meemoo/react-components';
import clsx from 'clsx';
import { compact, keyBy, mapValues, noop, without } from 'lodash-es';
import { type FC, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { useQueryParam } from 'use-query-params';

import { SearchBar } from '@shared/components/SearchBar';
import { tHtml, tText } from '@shared/helpers/translate';
import { selectIeObjectsFilterOptions } from '@shared/store/ie-objects/ie-objects.select';
import { visitorSpaceLabelKeys } from '@visitor-space/const/label-keys';
import { useGetContentPartners } from '@visitor-space/hooks/get-content-partner';

import { IeObjectsSearchFilterField } from '@shared/types/ie-objects';
import FilterFormButtons from '@visitor-space/components/FilterMenu/FilterFormButtons/FilterFormButtons';
import { AdvancedFilterArrayParam } from '@visitor-space/const/advanced-filter-array-param';
import {
	type DefaultFilterFormProps,
	ElasticsearchFieldNames,
	FILTER_LABEL_VALUE_DELIMITER,
	type FilterValue,
} from '@visitor-space/types';
import { initialFilterValues } from '../AdvancedFilterForm/AdvancedFilterForm.const';

const MaintainerFilterForm: FC<DefaultFilterFormProps> = ({
	className,
	id,
	initialValues,
	onSubmit,
	onReset,
}) => {
	const [initialValueFromQueryParams] = useQueryParam(
		IeObjectsSearchFilterField.MAINTAINER_ID,
		AdvancedFilterArrayParam
	);
	const [values, setValues] = useState<FilterValue[]>(
		initialValues || initialValueFromQueryParams || initialFilterValues(id)
	);
	const [search, setSearch] = useState<string>('');

	// Contains the filters that have already been applied and are present in the url
	const appliedSelectedMaintainerIds = compact(
		(values[0].multiValue || []).map(
			(maintainerIdAndName) => maintainerIdAndName?.split(FILTER_LABEL_VALUE_DELIMITER)?.[0]
		)
	);

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
	const checkboxOptions = filteredBuckets.map((filterOption) => {
		return {
			label: filterOption.name,
			value: filterOption.id,
			checked: appliedSelectedMaintainerIds.includes(filterOption.id),
		};
	});

	const idToIdAndNameConcatinated = useCallback(
		(id: string) => {
			if (!maintainers) {
				return '';
			}
			return `${id}${FILTER_LABEL_VALUE_DELIMITER}${maintainerNames?.[id] || ''}`;
		},
		[maintainers, maintainerNames]
	);

	const handleSubmit = () => {
		onSubmit([
			{
				...values[0],
				multiValue: (values[0].multiValue || []).map(idToIdAndNameConcatinated),
			},
		]);
	};

	const handleReset = () => {
		setValues(initialFilterValues(id));
		onReset();
	};

	const onItemClick = (checked: boolean, newMaintainer: unknown): void => {
		const oldSelectedMaintainers: string[] = (values[0]?.multiValue || []).map((val) => val);
		const newSelectedMaintainers = !checked
			? [...oldSelectedMaintainers, newMaintainer as string]
			: without(oldSelectedMaintainers, newMaintainer as string);
		setValues([
			{
				...values[0],
				multiValue: newSelectedMaintainers,
			},
		]);
	};

	return (
		<>
			<div className={clsx(className, 'u-px-20 u-px-32-md')}>
				<SearchBar
					id={`${visitorSpaceLabelKeys.filters.title}--${IeObjectsSearchFilterField.MAINTAINER_ID}`}
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

			<FilterFormButtons onSubmit={handleSubmit} onReset={handleReset} />
		</>
	);
};

export default MaintainerFilterForm;
