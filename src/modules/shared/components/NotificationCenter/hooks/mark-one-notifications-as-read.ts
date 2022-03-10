import { useMutation, UseMutationResult } from 'react-query';

import { NotificationsService } from '@shared/services/notifications-service/notifications.service';
import { Notification } from '@shared/services/notifications-service/notifications.types';

export function useMarkOneNotificationsAsRead(): UseMutationResult<Notification, unknown, string> {
	return useMutation(NotificationsService.markOneAsRead);
}
