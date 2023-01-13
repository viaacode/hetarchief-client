import { useMutation, UseMutationResult } from '@tanstack/react-query';

import { NotificationsService } from '@shared/services/notifications-service/notifications.service';
import { MarkAllAsReadResult } from '@shared/services/notifications-service/notifications.types';

export function useMarkAllNotificationsAsRead(): UseMutationResult<
	MarkAllAsReadResult,
	unknown,
	void
> {
	return useMutation(NotificationsService.markAllAsRead);
}
