import type { IPagination } from '@studiohyperdrive/pagination';
import { type UseInfiniteQueryResult, type UseMutationResult } from '@tanstack/react-query';
import { type ReactNode } from 'react';

import {
	type MarkAllAsReadResult,
	type Notification,
} from '@shared/services/notifications-service/notifications.types';
import { type DefaultComponentProps } from '@shared/types';

export interface NotificationCenterProps extends DefaultComponentProps {
	children?: ReactNode;
	isOpen: boolean;
	onClose: () => void;

	// Pass hook for mocking purposes
	useGetNotificationsHook: (
		enabled: boolean
	) => UseInfiniteQueryResult<IPagination<Notification>>;
	useMarkAllNotificationsAsReadHook: () => UseMutationResult<MarkAllAsReadResult, unknown, void>;
	useMarkOneNotificationsAsReadHook: () => UseMutationResult<Notification, unknown, string>;
}
