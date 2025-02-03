import { useMutation, type UseMutationResult } from '@tanstack/react-query';

import { NotificationsService } from '@shared/services/notifications-service/notifications.service';
import type { MarkAllAsReadResult } from '@shared/services/notifications-service/notifications.types';

export function useMarkAllNotificationsAsRead(): UseMutationResult<
	MarkAllAsReadResult,
	unknown,
	void
> {
	return useMutation(NotificationsService.markAllAsRead);
}
