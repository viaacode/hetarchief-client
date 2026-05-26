import { ReactSelect, type ReactSelectProps } from '@meemoo/react-components';
import { SEARCH_PAGE_QUERY_PARAM_CONFIG } from '@visitor-space/const';
import { getRightsOptions } from '@visitor-space/const/rights-filter.const';
import { SearchFilterId } from '@visitor-space/types';
import type { FC } from 'react';
import type { SingleValue } from 'react-select';
import { useQueryParams } from 'use-query-params';

export const AdvancedRightsSelect: FC<ReactSelectProps> = (props) => {
	const [query] = useQueryParams(SEARCH_PAGE_QUERY_PARAM_CONFIG);
	const options = getRightsOptions({
		mediaType: query[SearchFilterId.Format],
		reusabilityValues: query[SearchFilterId.Reusability],
	});
	const selectedValue = (props.value as SingleValue<{ label: string; value: string }>)?.value;

	return (
		<ReactSelect
			{...props}
			options={options}
			value={options.find((option) => option.value === selectedValue) || props.value}
		/>
	);
};
