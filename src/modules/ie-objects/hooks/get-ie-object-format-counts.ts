import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { isEmpty, isNil } from 'lodash-es';

import { QUERY_KEYS } from '@shared/const/query-keys';
import {
	IeObjectsSearchFilter,
	IeObjectsSearchFilterField,
	VisitorSpaceMediaType,
} from '@shared/types';
import { ElasticsearchFieldNames } from '@visitor-space/types';

import { IeObjectsService } from './../services';

export const useGetIeObjectFormatCounts = (
	filters: IeObjectsSearchFilter[],
	options: { enabled: boolean } = { enabled: true }
): UseQueryResult<Record<VisitorSpaceMediaType, number>> => {
	return useQuery(
		[QUERY_KEYS.getIeObjectFormatCounts, filters, options],
		async () => {
			const filterQuery = !isNil(filters) && !isEmpty(filters) ? filters : [];

			const results = await IeObjectsService.getSearchResults(filterQuery, 0, 0, undefined, [
				IeObjectsSearchFilterField.FORMAT,
			]);

			return Object.fromEntries(
				results.aggregations[ElasticsearchFieldNames.Format].buckets.map(
					(bucket: { key: string; doc_count: number }) => [
						bucket.key as VisitorSpaceMediaType,
						bucket.doc_count,
					]
				)
			);
		},
		{
			keepPreviousData: true,
			enabled: options.enabled,
		}
	);
};
