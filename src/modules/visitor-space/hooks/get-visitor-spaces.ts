import { OrderDirection } from '@meemoo/react-components';
import type { IPagination } from '@studiohyperdrive/pagination';
import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { QUERY_KEYS } from '@shared/const/query-keys';

import { VisitorSpaceService } from '../services';
import { VisitorSpaceInfo, VisitorSpaceOrderProps, VisitorSpaceStatus } from '../types';

export function useGetVisitorSpaces(
	searchInput: string | undefined,
	status: VisitorSpaceStatus[] | undefined,
	page: number,
	size: number,
	orderProp?: VisitorSpaceOrderProps,
	orderDirection?: OrderDirection
): UseQueryResult<IPagination<VisitorSpaceInfo>> {
	return useQuery(
		[
			QUERY_KEYS.getVisitorSpaces,
			{ searchInput, status, page, size, orderProp, orderDirection },
		],
		() =>
			VisitorSpaceService.getAll(searchInput, status, page, size, orderProp, orderDirection),
		{
			keepPreviousData: true,
		}
	);
}
