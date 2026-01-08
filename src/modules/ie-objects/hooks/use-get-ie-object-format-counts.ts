import { QUERY_KEYS } from '@shared/const/query-keys';
import {
	type IeObjectsSearchFilter,
	IeObjectsSearchFilterField,
	SearchPageMediaType,
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
	const allMediaTypes: SearchPageMediaType[] = [
		SearchPageMediaType.All,
		SearchPageMediaType.Audio,
		SearchPageMediaType.Video,
		SearchPageMediaType.Newspaper,
	];

	const buckets = results.aggregations[ElasticsearchFieldNames.Format].buckets;
	const counts: Record<SearchPageMediaType, number> = allMediaTypes.reduce(
		(acc, type) => {
			acc[type] = 0;
			return acc;
		},
		{} as Record<SearchPageMediaType, number>
	);
	for (const bucket of buckets) {
		const key = bucket.key as SearchPageMediaType;
		if (key in counts) {
			counts[key] = bucket.doc_count;
		}
	}
	return counts;
}

export const useGetIeObjectFormatCounts = (
	filters: IeObjectsSearchFilter[],
	options: { enabled?: boolean } = {}
): UseQueryResult<Record<SearchPageMediaType, number>> => {
	return useQuery({
		queryKey: [QUERY_KEYS.getIeObjectFormatCounts, filters, options],
		queryFn: async () => getIeObjectFormatCounts(filters),
		enabled: true,
		placeholderData: keepPreviousData,
		...options,
	});
};

export async function makeServerSideRequestGetIeObjectFormatCounts(queryClient: QueryClient) {
	await queryClient.prefetchQuery({
		queryKey: [QUERY_KEYS.getIeObjectFormatCounts, [], { enabled: true }],
		queryFn: () => getIeObjectFormatCounts([]),
	});
}
