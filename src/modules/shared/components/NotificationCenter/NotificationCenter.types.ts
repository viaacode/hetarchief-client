import type { IPagination } from '@studiohyperdrive/pagination';
import { UseInfiniteQueryResult, UseMutationResult } from '@tanstack/react-query';

import {
	MarkAllAsReadResult,
	Notification,
} from '@shared/services/notifications-service/notifications.types';
import { DefaultComponentProps } from '@shared/types';

export interface NotificationCenterProps extends DefaultComponentProps {
	isOpen: boolean;
	onClose: () => void;

	// Pass hook for mocking purposes
	useGetNotificationsHook: (
		enabled: boolean
	) => UseInfiniteQueryResult<IPagination<Notification>>;
	useMarkAllNotificationsAsReadHook: () => UseMutationResult<MarkAllAsReadResult, unknown, void>;
	useMarkOneNotificationsAsReadHook: () => UseMutationResult<Notification, unknown, string>;
}
