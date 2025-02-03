import { useMutation, type UseMutationResult } from '@tanstack/react-query';

import { NotificationsService } from '@shared/services/notifications-service/notifications.service';
import type { Notification } from '@shared/services/notifications-service/notifications.types';

export function useMarkOneNotificationsAsRead(): UseMutationResult<Notification, unknown, string> {
	return useMutation(NotificationsService.markOneAsRead);
}
