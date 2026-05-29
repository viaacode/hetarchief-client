import type { IeObjectSearchAggregations } from '@ie-objects/ie-objects.types';
import { ReactSelect, type ReactSelectProps } from '@meemoo/react-components';
import { selectIeObjectsFilterOptions } from '@shared/store/ie-objects';
import { SEARCH_PAGE_QUERY_PARAM_CONFIG } from '@visitor-space/const';
import { getRightsOptions, type RightsLabel } from '@visitor-space/const/rights-filter.const';
import { ElasticsearchFieldNames, SearchFilterId } from '@visitor-space/types';
import type { FC } from 'react';
import { useSelector } from 'react-redux';
import type { SingleValue } from 'react-select';
import { useQueryParams } from 'use-query-params';

export const AdvancedRightsSelect: FC<ReactSelectProps> = (props) => {
	const [query] = useQueryParams(SEARCH_PAGE_QUERY_PARAM_CONFIG);
	const selectedRightsValues = query[SearchFilterId.Reusability] || [];
	const searchAggregateOptions: IeObjectSearchAggregations | undefined = useSelector(
		selectIeObjectsFilterOptions
	);
	const availableRightsValues =
		searchAggregateOptions?.[ElasticsearchFieldNames.Rights]?.buckets?.map(
			(bucket) => bucket.key as RightsLabel
		) || [];
	const options = getRightsOptions(selectedRightsValues, availableRightsValues);
	const selectedValue = (props.value as SingleValue<{ label: string; value: string }>)?.value;

	return (
		<ReactSelect
			{...props}
			options={options}
			value={options.find((option) => option.value === selectedValue) || props.value}
		/>
	);
};
