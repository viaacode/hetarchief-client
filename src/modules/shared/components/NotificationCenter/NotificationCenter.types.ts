import { UseInfiniteQueryResult, UseMutationResult } from 'react-query';

import {
	MarkAllAsReadResult,
	Notification,
} from '@shared/services/notifications-service/notifications.types';
import { ApiResponseWrapper, DefaultComponentProps } from '@shared/types';

export interface NotificationCenterProps extends DefaultComponentProps {
	isOpen: boolean;
	onClose: () => void;

	// Pass hook for mocking purposes
	useGetNotificationsHook: (
		enabled: boolean
	) => UseInfiniteQueryResult<ApiResponseWrapper<Notification>>;
	useMarkAllNotificationsAsReadHook: () => UseMutationResult<MarkAllAsReadResult, unknown, void>;
	useMarkOneNotificationsAsReadHook: () => UseMutationResult<Notification, unknown, string>;
}
