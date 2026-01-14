import { QUERY_KEYS } from '@shared/const/query-keys';
import {
	type IeObjectsSearchFilter,
	IeObjectsSearchFilterField,
	type SearchPageMediaType,
} from '@shared/types/ie-objects';
import {
	keepPreviousData,
	type QueryClient,
	type UseQueryResult,
	useQuery,
} from '@tanstack/react-query';
import { ElasticsearchFieldNames } from '@visitor-space/types';
import { isEmpty, isNil } from 'lodash-es';

import { IeObjectsService } from './../services';

export async function getIeObjectFormatCounts(
	filters: IeObjectsSearchFilter[]
): Promise<Record<SearchPageMediaType, number>> {
	const filterQuery = !isNil(filters) && !isEmpty(filters) ? filters : [];

	const results = await IeObjectsService.getSearchResults(filterQuery, 0, 0, undefined, [
		IeObjectsSearchFilterField.FORMAT,
	]);

	// Get all possible media types
	return Object.fromEntries(
		results.aggregations[ElasticsearchFieldNames.Format].buckets.map(
			(bucket): [SearchPageMediaType, number] => [
				bucket.key as SearchPageMediaType,
				bucket.doc_count,
			]
		)
	) as Record<SearchPageMediaType, number>;
}

export const useGetIeObjectFormatCounts = (
	filters: IeObjectsSearchFilter[],
	enabled: boolean = true
): UseQueryResult<Record<SearchPageMediaType, number>> => {
	return useQuery({
		queryKey: [QUERY_KEYS.getIeObjectFormatCounts, filters],
		queryFn: async () => getIeObjectFormatCounts(filters),
		placeholderData: keepPreviousData,
		enabled,
	});
};

export async function makeServerSideRequestGetIeObjectFormatCounts(queryClient: QueryClient) {
	await queryClient.prefetchQuery({
		queryKey: [QUERY_KEYS.getIeObjectFormatCounts, [], { enabled: true }],
		queryFn: () => getIeObjectFormatCounts([]),
	});
}
