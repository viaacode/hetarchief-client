import { useInfiniteQuery, UseInfiniteQueryResult } from 'react-query';

import { QUERY_KEYS } from '@shared/const/query-keys';
import { NotificationsService } from '@shared/services/notifications-service/notifications.service';
import { Notification } from '@shared/services/notifications-service/notifications.types';
import { ApiResponseWrapper } from '@shared/types/api';

export function useGetNotifications(): UseInfiniteQueryResult<ApiResponseWrapper<Notification>> {
	return useInfiniteQuery(
		QUERY_KEYS.getNotifications,
		({ pageParam = 1 }) => NotificationsService.getNotifications(pageParam, 20),
		{
			getNextPageParam: (lastPage) => lastPage.page + 1,
		}
	);
}
