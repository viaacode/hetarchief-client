import { UseMutationResult } from 'react-query';
import { InfiniteQueryObserverSuccessResult } from 'react-query/types/core/types';

import {
	MarkAllAsReadResult,
	Notification,
	NotificationStatus,
	NotificationType,
} from '@shared/services/notifications-service/notifications.types';
import { ApiResponseWrapper } from '@shared/types';

import { NotificationCenterProps } from '../NotificationCenter.types';

const mockTitle = 'Je bezoek aanvraag is goedgekeurd';
const mockDescription =
	'Je bezoek aanvraag aan de leeszaal van Gents museum is goedgekeurd, je hebt toegang van 12:00 to 16:00 op 17 feb 2022';

export const NOTIFICATIONS_FIRST_PAGE: ApiResponseWrapper<Notification> = {
	items: [
		{
			id: '0274356c-249b-4337-ac07-649dfefbbe2f',
			description: mockDescription,
			title: mockTitle + ' 0',
			status: NotificationStatus.UNREAD,
			visitId: '0fb12a25-a882-42f7-9c79-9d77839c7237',
			createdAt: '2022-02-25T17:21:58.937169+00:00',
			updatedAt: '2022-03-02T17:53:48.880887',
			type: NotificationType.NEW_VISIT_REQUEST,
			readingRoomId: 'c3857d2a-a818-4bec-b420-2fe0275604ff',
		},
		{
			id: 'e1c4c9e3-3e6e-4783-8324-0b6d78b5bd14',
			description: mockDescription,
			title: mockTitle + ' 1',
			status: NotificationStatus.UNREAD,
			visitId: '0fb12a25-a882-42f7-9c79-9d77839c7237',
			createdAt: '2022-02-25T17:21:58.937169+00:00',
			updatedAt: '2022-03-02T17:54:01.328785',
			type: NotificationType.NEW_VISIT_REQUEST,
			readingRoomId: 'c3857d2a-a818-4bec-b420-2fe0275604ff',
		},
		{
			id: 'c19e9e7e-047a-4be7-8d06-4e71fae6f747',
			description: mockDescription,
			title: mockTitle + ' 2',
			status: NotificationStatus.UNREAD,
			visitId: '0fb12a25-a882-42f7-9c79-9d77839c7237',
			createdAt: '2022-02-25T17:21:58.937169+00:00',
			updatedAt: '2022-03-02T17:54:03.791078',
			type: NotificationType.NEW_VISIT_REQUEST,
			readingRoomId: 'c3857d2a-a818-4bec-b420-2fe0275604ff',
		},
		{
			id: 'e3b87067-4001-4c3b-b73f-d496e3494a62',
			description: mockDescription,
			title: mockTitle + ' 3',
			status: NotificationStatus.UNREAD,
			visitId: '0fb12a25-a882-42f7-9c79-9d77839c7237',
			createdAt: '2022-02-25T17:21:58.937169+00:00',
			updatedAt: '2022-03-02T17:52:24.361032',
			type: NotificationType.NEW_VISIT_REQUEST,
			readingRoomId: 'c3857d2a-a818-4bec-b420-2fe0275604ff',
		},
		{
			id: 'b1a40094-c31f-471d-9239-4f4d54578062',
			description: mockDescription,
			title: mockTitle + ' 4',
			status: NotificationStatus.UNREAD,
			visitId: '0fb12a25-a882-42f7-9c79-9d77839c7237',
			createdAt: '2022-02-25T17:21:58.937169+00:00',
			updatedAt: '2022-03-02T17:52:25.500478',
			type: NotificationType.NEW_VISIT_REQUEST,
			readingRoomId: 'c3857d2a-a818-4bec-b420-2fe0275604ff',
		},
		{
			id: '4b1e9195-ee7d-4676-ba84-28091fc1473d',
			description: mockDescription,
			title: mockTitle + ' 5',
			status: NotificationStatus.UNREAD,
			visitId: '0fb12a25-a882-42f7-9c79-9d77839c7237',
			createdAt: '2022-02-25T17:21:58.937169+00:00',
			updatedAt: '2022-03-02T17:52:37.908251',
			type: NotificationType.NEW_VISIT_REQUEST,
			readingRoomId: 'c3857d2a-a818-4bec-b420-2fe0275604ff',
		},
		{
			id: '6a045f7a-33c0-444d-beb6-98ff10610980',
			description: mockDescription,
			title: mockTitle + ' 6',
			status: NotificationStatus.READ,
			visitId: '0fb12a25-a882-42f7-9c79-9d77839c7237',
			createdAt: '2022-02-25T17:21:58.937169+00:00',
			updatedAt: '2022-03-02T17:52:37.338439',
			type: NotificationType.NEW_VISIT_REQUEST,
			readingRoomId: 'c3857d2a-a818-4bec-b420-2fe0275604ff',
		},
		{
			id: 'b9b44488-9b5a-4ee3-a231-6ee263230b11',
			description: mockDescription,
			title: mockTitle + ' 7',
			status: NotificationStatus.READ,
			visitId: '0fb12a25-a882-42f7-9c79-9d77839c7237',
			createdAt: '2022-02-25T17:21:58.937169+00:00',
			updatedAt: '2022-03-02T17:52:34.666981',
			type: NotificationType.NEW_VISIT_REQUEST,
			readingRoomId: 'c3857d2a-a818-4bec-b420-2fe0275604ff',
		},
		{
			id: '08d6a4ee-8ea0-4a0d-b0da-5557837f8f94',
			description: mockDescription,
			title: mockTitle + ' 8',
			status: NotificationStatus.READ,
			visitId: '0fb12a25-a882-42f7-9c79-9d77839c7237',
			createdAt: '2022-02-25T17:21:58.937169+00:00',
			updatedAt: '2022-03-02T17:52:36.136993',
			type: NotificationType.NEW_VISIT_REQUEST,
			readingRoomId: 'c3857d2a-a818-4bec-b420-2fe0275604ff',
		},
		{
			id: 'e861235a-a95e-44ed-a48d-192762378532',
			description: mockDescription,
			title: mockTitle + ' 9',
			status: NotificationStatus.READ,
			visitId: '0fb12a25-a882-42f7-9c79-9d77839c7237',
			createdAt: '2022-02-25T17:21:58.937169+00:00',
			updatedAt: '2022-03-02T17:52:36.723444',
			type: NotificationType.NEW_VISIT_REQUEST,
			readingRoomId: 'c3857d2a-a818-4bec-b420-2fe0275604ff',
		},
		{
			id: 'bfcae082-2370-4a2b-9f66-a55c869addfb',
			description: mockDescription,
			title: mockTitle + ' 10',
			status: NotificationStatus.READ,
			visitId: '0fb12a25-a882-42f7-9c79-9d77839c7237',
			createdAt: '2022-02-25T17:21:58.937169+00:00',
			updatedAt: '2022-02-28T17:54:59.894586',
			type: NotificationType.NEW_VISIT_REQUEST,
			readingRoomId: 'c3857d2a-a818-4bec-b420-2fe0275604ff',
		},
		{
			id: 'c609a045-fbe8-463f-8c41-ce4dfd8858f9',
			description: mockDescription,
			title: mockTitle + ' 11',
			status: NotificationStatus.READ,
			visitId: '0fb12a25-a882-42f7-9c79-9d77839c7237',
			createdAt: '2022-02-25T17:21:58.937169+00:00',
			updatedAt: '2022-02-28T17:54:59.894586',
			type: NotificationType.NEW_VISIT_REQUEST,
			readingRoomId: 'c3857d2a-a818-4bec-b420-2fe0275604ff',
		},
		{
			id: '2945d515-0378-46a5-b102-c34d6c1e650d',
			description: mockDescription,
			title: mockTitle + ' 12',
			status: NotificationStatus.READ,
			visitId: '0fb12a25-a882-42f7-9c79-9d77839c7237',
			createdAt: '2022-02-25T17:21:58.937169+00:00',
			updatedAt: '2022-02-28T17:54:59.894586',
			type: NotificationType.NEW_VISIT_REQUEST,
			readingRoomId: 'c3857d2a-a818-4bec-b420-2fe0275604ff',
		},
		{
			id: '972ef654-9ba5-40cf-8db5-bec713f5a6fc',
			description: mockDescription,
			title: mockTitle + ' 13',
			status: NotificationStatus.READ,
			visitId: '0fb12a25-a882-42f7-9c79-9d77839c7237',
			createdAt: '2022-02-25T17:21:58.937169+00:00',
			updatedAt: '2022-02-28T17:54:59.894586',
			type: NotificationType.NEW_VISIT_REQUEST,
			readingRoomId: 'c3857d2a-a818-4bec-b420-2fe0275604ff',
		},
		{
			id: '3665d1b7-1762-4939-9a47-1c1765b02576',
			description: mockDescription,
			title: mockTitle + ' 14',
			status: NotificationStatus.READ,
			visitId: '0fb12a25-a882-42f7-9c79-9d77839c7237',
			createdAt: '2022-02-25T17:21:58.937169+00:00',
			updatedAt: '2022-02-28T17:54:59.894586',
			type: NotificationType.NEW_VISIT_REQUEST,
			readingRoomId: 'c3857d2a-a818-4bec-b420-2fe0275604ff',
		},
		{
			id: 'af0d1847-0404-481f-83af-e53df2bfb750',
			description: mockDescription,
			title: mockTitle + ' 15',
			status: NotificationStatus.READ,
			visitId: '0fb12a25-a882-42f7-9c79-9d77839c7237',
			createdAt: '2022-02-25T17:21:58.937169+00:00',
			updatedAt: '2022-02-28T17:54:59.894586',
			type: NotificationType.NEW_VISIT_REQUEST,
			readingRoomId: 'c3857d2a-a818-4bec-b420-2fe0275604ff',
		},
		{
			id: '888fbe32-703c-4717-b622-c1d65e4ceb1c',
			description: mockDescription,
			title: mockTitle + ' 16',
			status: NotificationStatus.READ,
			visitId: '0fb12a25-a882-42f7-9c79-9d77839c7237',
			createdAt: '2022-02-25T17:21:58.937169+00:00',
			updatedAt: '2022-02-28T17:54:59.894586',
			type: NotificationType.NEW_VISIT_REQUEST,
			readingRoomId: 'c3857d2a-a818-4bec-b420-2fe0275604ff',
		},
		{
			id: 'e2db281b-7c99-4337-8d71-610f3c4efff6',
			description: mockDescription,
			title: mockTitle + ' 17',
			status: NotificationStatus.READ,
			visitId: '0fb12a25-a882-42f7-9c79-9d77839c7237',
			createdAt: '2022-02-25T17:21:58.937169+00:00',
			updatedAt: '2022-02-28T17:54:59.894586',
			type: NotificationType.NEW_VISIT_REQUEST,
			readingRoomId: 'c3857d2a-a818-4bec-b420-2fe0275604ff',
		},
		{
			id: '631fd24f-52cb-4004-afd3-6bd1deb0b6ea',
			description: mockDescription,
			title: mockTitle + ' 18',
			status: NotificationStatus.READ,
			visitId: '0fb12a25-a882-42f7-9c79-9d77839c7237',
			createdAt: '2022-02-25T17:21:58.937169+00:00',
			updatedAt: '2022-02-28T17:54:59.894586',
			type: NotificationType.NEW_VISIT_REQUEST,
			readingRoomId: 'c3857d2a-a818-4bec-b420-2fe0275604ff',
		},
		{
			id: 'e69f9ec9-21ec-4310-9a8c-5180c48fe6a7',
			description: mockDescription,
			title: mockTitle + ' 19',
			status: NotificationStatus.READ,
			visitId: '0fb12a25-a882-42f7-9c79-9d77839c7237',
			createdAt: '2022-02-25T17:21:58.937169+00:00',
			updatedAt: '2022-02-28T17:54:59.894586',
			type: NotificationType.NEW_VISIT_REQUEST,
			readingRoomId: 'c3857d2a-a818-4bec-b420-2fe0275604ff',
		},
	],
	total: 59,
	pages: 3,
	page: 1,
	size: 20,
};

const notificationsHookResponse = {
	data: { pages: [NOTIFICATIONS_FIRST_PAGE], pageParams: [{ page: 1 }] },
	fetchNextPage: async () => {
		// empty for mocking purposes
	},
	isError: false,
	isLoading: false,
	refetch: () => {
		// empty for mocking purposes
	},
} as unknown as InfiniteQueryObserverSuccessResult<ApiResponseWrapper<Notification>>;

const useMarkOneNotificationsAsReadResponse = {
	mutateAsync: () => {
		// empty for mocking purposes
	},
} as unknown as UseMutationResult<Notification, unknown, string>;

const useMarkAllNotificationsAsReadResponse = {
	mutateAsync: () => {
		// empty for mocking purposes
	},
} as unknown as UseMutationResult<MarkAllAsReadResult, unknown, void>;

export const notificationCenterMock: NotificationCenterProps = {
	isOpen: true,
	onClose: () => null,
	useGetNotificationsHook: () => notificationsHookResponse,
	useMarkOneNotificationsAsReadHook: () => useMarkOneNotificationsAsReadResponse,
	useMarkAllNotificationsAsReadHook: () => useMarkAllNotificationsAsReadResponse,
};
