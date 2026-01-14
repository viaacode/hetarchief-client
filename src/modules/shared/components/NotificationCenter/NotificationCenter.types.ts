import type {
	MarkAllAsReadResult,
	Notification,
} from '@shared/services/notifications-service/notifications.types';
import type { DefaultComponentProps } from '@shared/types';
import type { IPagination } from '@studiohyperdrive/pagination';
import type {
	InfiniteData,
	UseInfiniteQueryResult,
	UseMutationResult,
} from '@tanstack/react-query';
import type { ReactNode } from 'react';

export interface NotificationCenterProps extends DefaultComponentProps {
	children?: ReactNode;
	isOpen: boolean;
	onClose: () => void;

	// Pass hook for mocking purposes
	useGetNotificationsHook: (
		enabled: boolean
	) => UseInfiniteQueryResult<InfiniteData<IPagination<Notification>>>;
	useMarkAllNotificationsAsReadHook: () => UseMutationResult<MarkAllAsReadResult, unknown, void>;
	useMarkOneNotificationsAsReadHook: () => UseMutationResult<Notification, unknown, string>;
}
