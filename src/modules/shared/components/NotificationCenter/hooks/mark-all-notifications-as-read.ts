import { NotificationsService } from '@shared/services/notifications-service/notifications.service';
import type { MarkAllAsReadResult } from '@shared/services/notifications-service/notifications.types';
import { type UseMutationResult, useMutation } from '@tanstack/react-query';

export function useMarkAllNotificationsAsRead(): UseMutationResult<
	MarkAllAsReadResult,
	unknown,
	void
> {
	return useMutation({
		mutationFn: NotificationsService.markAllAsRead,
	});
}
