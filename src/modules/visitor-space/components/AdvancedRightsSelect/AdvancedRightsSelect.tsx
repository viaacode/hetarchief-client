import type { IeObjectSearchAggregations } from '@ie-objects/ie-objects.types';
import { ReactSelect, type ReactSelectProps } from '@meemoo/react-components';
import { selectIeObjectsFilterOptions } from '@shared/store/ie-objects';
import { SEARCH_PAGE_QUERY_PARAM_CONFIG } from '@visitor-space/const';
import { getRightsOptions, RightsLabel } from '@visitor-space/const/rights-filter.const';
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

	// Combine buckets from both aggregation types (dcterms_rights_statement for newspapers,
	// reuse_category.id for audio/video). Normalise to uppercase to match the RightsLabel enum.
	const allRightsLabels = Object.values(RightsLabel) as string[];
	const availableRightsValues = [
		...(searchAggregateOptions?.[ElasticsearchFieldNames.RightsForNewspaper]?.buckets || []),
		...(searchAggregateOptions?.[ElasticsearchFieldNames.RightsForAudioVideo]?.buckets || []),
	].reduce<RightsLabel[]>((acc, bucket) => {
		const match = allRightsLabels.find(
			(label) => label.toLowerCase() === (bucket.key as string).toLowerCase()
		) as RightsLabel | undefined;
		if (match && !acc.includes(match)) {
			acc.push(match);
		}
		return acc;
	}, []);

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
