import { NotificationsService } from '@shared/services/notifications-service/notifications.service';
import type { Notification } from '@shared/services/notifications-service/notifications.types';
import { type UseMutationResult, useMutation } from '@tanstack/react-query';

export function useMarkOneNotificationsAsRead(): UseMutationResult<Notification, unknown, string> {
	return useMutation({
		mutationFn: NotificationsService.markOneAsRead,
	});
}
