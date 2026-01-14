import { QUERY_KEYS } from '@shared/const/query-keys';
import type { IPagination } from '@studiohyperdrive/pagination';
import { keepPreviousData, type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { AvoSearchOrderDirection } from '@viaa/avo2-types';
import { VisitorSpaceService } from '../services';
import type { VisitorSpaceInfo, VisitorSpaceOrderProps, VisitorSpaceStatus } from '../types';

export function useGetVisitorSpaces(
	searchInput: string | undefined,
	status: VisitorSpaceStatus[] | undefined,
	page: number,
	size: number,
	orderProp?: VisitorSpaceOrderProps,
	orderDirection?: AvoSearchOrderDirection
): UseQueryResult<IPagination<VisitorSpaceInfo>> {
	return useQuery({
		queryKey: [
			QUERY_KEYS.getVisitorSpaces,
			{ searchInput, status, page, size, orderProp, orderDirection },
		],
		queryFn: () =>
			VisitorSpaceService.getAll(searchInput, status, page, size, orderProp, orderDirection),
		placeholderData: keepPreviousData,
	});
}
