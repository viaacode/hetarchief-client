import type { IPagination } from '@studiohyperdrive/pagination';
import { useInfiniteQuery, UseInfiniteQueryResult } from '@tanstack/react-query';

import { QUERY_KEYS } from '@shared/const/query-keys';
import { NotificationsService } from '@shared/services/notifications-service/notifications.service';
import { Notification } from '@shared/services/notifications-service/notifications.types';

export function useGetNotifications(
	enabled: boolean
): UseInfiniteQueryResult<IPagination<Notification>> {
	return useInfiniteQuery(
		[QUERY_KEYS.getNotifications],
		({ pageParam = 1 }) => NotificationsService.getNotifications(pageParam, 20),
		{
			getNextPageParam: (lastPage) => lastPage.page + 1,
			keepPreviousData: true,
			enabled,
		}
	);
}
