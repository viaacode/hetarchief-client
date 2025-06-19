import { type QueryClient, type UseQueryResult, useQuery } from '@tanstack/react-query';
import { isEmpty, isNil } from 'lodash-es';

import { QUERY_KEYS } from '@shared/const/query-keys';
import {
	type IeObjectsSearchFilter,
	IeObjectsSearchFilterField,
	type SearchPageMediaType,
} from '@shared/types/ie-objects';
import { ElasticsearchFieldNames } from '@visitor-space/types';

import { IeObjectsService } from './../services';

export async function getIeObjectFormatCounts(filters: IeObjectsSearchFilter[]) {
	const filterQuery = !isNil(filters) && !isEmpty(filters) ? filters : [];

	const results = await IeObjectsService.getSearchResults(filterQuery, 0, 0, undefined, [
		IeObjectsSearchFilterField.FORMAT,
	]);

	return Object.fromEntries(
		results.aggregations[ElasticsearchFieldNames.Format].buckets.map((bucket) => [
			bucket.key as SearchPageMediaType,
			bucket.doc_count,
		])
	);
}

export const useGetIeObjectFormatCounts = (
	filters: IeObjectsSearchFilter[],
	options: { enabled?: boolean } = {}
): UseQueryResult<Record<SearchPageMediaType, number>> => {
	return useQuery(
		[QUERY_KEYS.getIeObjectFormatCounts, filters, options],
		async () => getIeObjectFormatCounts(filters),
		{
			enabled: true,
			keepPreviousData: true,
			...options,
		}
	);
};

export async function makeServerSideRequestGetIeObjectFormatCounts(queryClient: QueryClient) {
	await queryClient.prefetchQuery({
		queryKey: [QUERY_KEYS.getIeObjectFormatCounts, [], { enabled: true }],
		queryFn: () => getIeObjectFormatCounts([]),
	});
}
