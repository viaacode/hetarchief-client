import { QUERY_KEYS } from '@shared/const/query-keys';
import { NotificationsService } from '@shared/services/notifications-service/notifications.service';
import type { Notification } from '@shared/services/notifications-service/notifications.types';
import type { IPagination } from '@studiohyperdrive/pagination';
import {
	type InfiniteData,
	keepPreviousData,
	type UseInfiniteQueryResult,
	useInfiniteQuery,
} from '@tanstack/react-query';

export function useGetNotifications(
	enabled: boolean = true
): UseInfiniteQueryResult<InfiniteData<IPagination<Notification>>> {
	return useInfiniteQuery({
		queryKey: [QUERY_KEYS.getNotifications],
		queryFn: ({ pageParam }): Promise<IPagination<Notification>> =>
			NotificationsService.getNotifications(pageParam as number, 20),
		getNextPageParam: (lastPage: IPagination<Notification>) => lastPage.page + 1,
		initialPageParam: 1,
		placeholderData: keepPreviousData,
		enabled,
	});
}
