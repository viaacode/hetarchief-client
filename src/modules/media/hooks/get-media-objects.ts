import { useQuery } from 'react-query';
import { UseQueryResult } from 'react-query/types/react/types';
import { useDispatch } from 'react-redux';

import { MediaService } from '@media/services';
import { QUERY_KEYS } from '@shared/const/query-keys';
import { setResults } from '@shared/store/media';
import { GetMedia, MediaSearchFilterField, MediaSearchFilters, SortObject } from '@shared/types';

export function useGetMediaObjects(
	slug: string,
	filters: MediaSearchFilters,
	page: number,
	size: number,
	sort?: SortObject,
	enabled = true
): UseQueryResult<GetMedia> {
	const dispatch = useDispatch();

	return useQuery(
		[QUERY_KEYS.getMediaObjects, { slug, filters, page, size, sort, enabled }],
		() => {
			// TODO: improve ⚠️
			// Run three queries:
			//     - One to fetch the results for a specific tab (results),
			//     - one to fetch the aggregates without any criteria to populate filters (noFilters)
			//     - and one to fetch the aggregates across tabs (noFormat)
			return Promise.all([
				MediaService.getBySpace(slug, filters, page, size, sort),
				MediaService.getBySpace(slug, [], page, size, sort),
				MediaService.getBySpace(
					slug,
					filters.filter((item) => item.field !== MediaSearchFilterField.FORMAT),
					page,
					size,
					sort
				),
			]).then((responses) => {
				const [results, noFilters, noFormat] = responses;
				const output = {
					...results,
					aggregations: {
						...noFilters.aggregations,
						dcterms_format: noFormat.aggregations.dcterms_format,
					},
				};

				dispatch(setResults(output));

				return output;
			});
		},
		{
			keepPreviousData: true,
			enabled,
		}
	);
}
