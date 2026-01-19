/* eslint-disable @typescript-eslint/no-explicit-any */

import { NotificationsService } from '@shared/services/notifications-service/notifications.service';
import { toastService } from '@shared/services/toast-service';
import { afterEach, describe, expect, it, vi } from 'vitest';

const oldDate = '2022-05-03T16:30:39.70604+00:00';
const newDate = '2022-05-04T16:30:48.824352+00:00';
const newestDate = '2022-05-05T16:30:48.824352+00:00';

const mockReadNotification = {
	id: '66f12986-a17a-44be-9b1d-1966fa28ee65',
	description:
		'Je aanvraag voor bezoekersruimte AMVB is goedgekeurd. Je zal toegang hebben van 03/05/2022 17:45 tot 03/05/2022 19:30',
	title: 'Je aanvraag voor bezoekersruimte AMVB is goedgekeurd',
	status: 'READ',
	visitId: '8ad7d557-5dd0-42a6-99e8-4da9c65e35fe',
	createdAt: oldDate,
	updatedAt: oldDate,
	type: 'VISIT_REQUEST_APPROVED',
	visitorSpaceSlug: 'amvb',
};

const mockUnreadNotification = {
	id: '5467ed49-23d7-40a2-b5cc-4408a98f268b',
	description: 'Je toegang vervalt terug op 03/05/2022 19:30',
	title: 'Je hebt nu toegang tot de bezoekersruimte AMVB',
	status: 'UNREAD',
	visitId: '8ad7d557-5dd0-42a6-99e8-4da9c65e35fe',
	createdAt: oldDate,
	updatedAt: oldDate,
	type: 'ACCESS_PERIOD_VISITOR_SPACE_STARTED',
	visitorSpaceSlug: 'amvb',
};

const mockNewUnreadNotification = {
	id: '5467ed49-23d7-40a2-b5cc-4408a98f268b',
	description: 'Je toegang vervalt terug op 03/05/2022 19:30',
	title: 'Je hebt nu toegang tot de bezoekersruimte AMVB',
	status: 'UNREAD',
	visitId: '8ad7d557-5dd0-42a6-99e8-4da9c65e35fe',
	createdAt: newDate,
	updatedAt: newDate,
	type: 'ACCESS_PERIOD_VISITOR_SPACE_STARTED',
	visitorSpaceSlug: 'amvb',
};

describe('NotificationService', () => {
	afterEach(() => {
		NotificationsService.resetService();
	});

	describe('checkNotifications()', () => {
		it('Should not show any toasts when the first notifications are fetched and the response is empty', async () => {
			const mockSetHasUnreadNotifications = vi.fn();
			await NotificationsService.initPolling(
				// biome-ignore lint/suspicious/noExplicitAny: Test case
				null as any,
				// biome-ignore lint/suspicious/noExplicitAny: Test case
				null as any,
				mockSetHasUnreadNotifications
			);
			const mockGetNotifications = vi.fn();
			// biome-ignore lint/suspicious/noExplicitAny: Test case
			(mockGetNotifications.mockResolvedValueOnce as any)({
				items: [],
				total: 0,
				pages: 1,
				page: 1,
				size: 20,
			});
			// biome-ignore lint/suspicious/noExplicitAny: Test case
			NotificationsService.getNotifications = mockGetNotifications as any;
			const mockedNotifyFunc = vi.fn();
			// biome-ignore lint/suspicious/noExplicitAny: Test case
			toastService.notify = mockedNotifyFunc as any;

			await NotificationsService.checkNotifications();

			expect(mockedNotifyFunc).toBeCalledTimes(0);

			expect(mockSetHasUnreadNotifications).toBeCalledTimes(0);
		});

		it('Should not show any toasts when the first notifications are fetched and the response contains only READ notifications', async () => {
			const mockSetHasUnreadNotifications = vi.fn();
			await NotificationsService.initPolling(
				// biome-ignore lint/suspicious/noExplicitAny: Test case with null
				null as any,
				// biome-ignore lint/suspicious/noExplicitAny: Test case with null
				null as any,
				mockSetHasUnreadNotifications
			);
			const mockGetNotifications = vi.fn();
			// biome-ignore lint/suspicious/noExplicitAny: Test case
			(mockGetNotifications.mockResolvedValueOnce as any)({
				items: [mockReadNotification, mockReadNotification],
				total: 2,
				pages: 1,
				page: 1,
				size: 20,
			});
			// biome-ignore lint/suspicious/noExplicitAny: Test case
			NotificationsService.getNotifications = mockGetNotifications as any;
			// biome-ignore lint/suspicious/noExplicitAny: Test case
			const mockedNotifyFunc = vi.fn() as any;
			toastService.notify = mockedNotifyFunc;

			await NotificationsService.checkNotifications();

			expect(mockedNotifyFunc).toBeCalledTimes(0);

			expect(mockSetHasUnreadNotifications).toBeCalledTimes(0);
		});

		it('Should not show any toasts when the first notifications are fetched and the response contains only UNREAD notifications', async () => {
			const mockSetHasUnreadNotifications = vi.fn();
			await NotificationsService.initPolling(
				// biome-ignore lint/suspicious/noExplicitAny: Test case
				null as any,
				// biome-ignore lint/suspicious/noExplicitAny: Test case
				null as any,
				mockSetHasUnreadNotifications
			);

			const mockGetNotifications = vi.fn();
			// biome-ignore lint/suspicious/noExplicitAny: Test case
			(mockGetNotifications.mockResolvedValueOnce as any)({
				items: [mockUnreadNotification, mockUnreadNotification],
				total: 2,
				pages: 1,
				page: 1,
				size: 20,
			});
			// biome-ignore lint/suspicious/noExplicitAny: Test case
			NotificationsService.getNotifications = mockGetNotifications as any;
			// biome-ignore lint/suspicious/noExplicitAny: Test case
			const mockedNotifyFunc = vi.fn() as any;
			toastService.notify = mockedNotifyFunc;

			await NotificationsService.checkNotifications();

			expect(mockedNotifyFunc).toBeCalledTimes(0);

			expect(mockSetHasUnreadNotifications).toBeCalledTimes(1);
		});

		it('Should not show any toasts when the first notifications are fetched and the response contains both UNREAD and READ notifications', async () => {
			const mockSetHasUnreadNotifications = vi.fn();
			await NotificationsService.initPolling(
				// biome-ignore lint/suspicious/noExplicitAny: Test case
				null as any,
				// biome-ignore lint/suspicious/noExplicitAny: Test case
				null as any,
				mockSetHasUnreadNotifications
			);

			const mockGetNotifications = vi.fn();
			// biome-ignore lint/suspicious/noExplicitAny: Test case
			(mockGetNotifications.mockResolvedValueOnce as any)({
				items: [mockUnreadNotification, mockReadNotification],
				total: 2,
				pages: 1,
				page: 1,
				size: 20,
			});
			// biome-ignore lint/suspicious/noExplicitAny: Test case
			NotificationsService.getNotifications = mockGetNotifications as any;
			// biome-ignore lint/suspicious/noExplicitAny: Test case
			const mockedNotifyFunc = vi.fn() as any;
			toastService.notify = mockedNotifyFunc;

			await NotificationsService.checkNotifications();

			expect(mockedNotifyFunc).toBeCalledTimes(0);

			expect(mockSetHasUnreadNotifications).toBeCalledTimes(1);
		});

		it('Should show a single toasts when a new UNREAD notification is fetched', async () => {
			const mockSetHasUnreadNotifications = vi.fn();
			await NotificationsService.initPolling(
				// biome-ignore lint/suspicious/noExplicitAny: Test case
				null as any,
				// biome-ignore lint/suspicious/noExplicitAny: Test case
				null as any,
				mockSetHasUnreadNotifications
			);

			const mockGetNotifications = vi.fn();
			// biome-ignore lint/suspicious/noExplicitAny: Test case
			(mockGetNotifications.mockResolvedValueOnce as any)({
				items: [mockUnreadNotification, mockReadNotification],
				total: 2,
				pages: 1,
				page: 1,
				size: 20,
			});
			// biome-ignore lint/suspicious/noExplicitAny: Test case
			(mockGetNotifications.mockResolvedValueOnce as any)({
				items: [mockNewUnreadNotification, mockUnreadNotification, mockReadNotification],
				total: 3,
				pages: 1,
				page: 1,
				size: 20,
			});
			// biome-ignore lint/suspicious/noExplicitAny: Test case
			NotificationsService.getNotifications = mockGetNotifications as any;
			// biome-ignore lint/suspicious/noExplicitAny: Test case
			const mockedNotifyFunc = vi.fn() as any;
			toastService.notify = mockedNotifyFunc;

			// Initial fetch
			await NotificationsService.checkNotifications();

			expect(mockedNotifyFunc).toBeCalledTimes(0);

			// Next fetch
			await NotificationsService.checkNotifications();

			expect(mockedNotifyFunc).toBeCalledTimes(1);
			expect(mockedNotifyFunc).toBeCalledWith(
				expect.objectContaining({
					buttonLabel: '',
					description: 'Je toegang vervalt terug op 03/05/2022 19:30',
					title: 'Je hebt nu toegang tot de bezoekersruimte AMVB',
				})
			);

			expect(mockSetHasUnreadNotifications).toBeCalledTimes(2);
		});

		it('Should show a single toasts when multiple new UNREAD notifications are fetched', async () => {
			const mockSetHasUnreadNotifications = vi.fn();
			await NotificationsService.initPolling(
				// biome-ignore lint/suspicious/noExplicitAny: Test case
				null as any,
				// biome-ignore lint/suspicious/noExplicitAny: Test case
				null as any,
				mockSetHasUnreadNotifications
			);

			const mockGetNotifications = vi.fn();
			// biome-ignore lint/suspicious/noExplicitAny: Test case
			(mockGetNotifications.mockResolvedValueOnce as any)({
				items: [mockUnreadNotification, mockReadNotification],
				total: 2,
				pages: 1,
				page: 1,
				size: 20,
			});
			// biome-ignore lint/suspicious/noExplicitAny: Test case
			(mockGetNotifications.mockResolvedValueOnce as any)({
				items: [
					mockNewUnreadNotification,
					mockNewUnreadNotification,
					mockUnreadNotification,
					mockReadNotification,
				],
				total: 3,
				pages: 1,
				page: 1,
				size: 20,
			});
			// biome-ignore lint/suspicious/noExplicitAny: Test case
			NotificationsService.getNotifications = mockGetNotifications as any;
			// biome-ignore lint/suspicious/noExplicitAny: Test case
			const mockedNotifyFunc = vi.fn() as any;
			toastService.notify = mockedNotifyFunc;

			// Initial fetch
			await NotificationsService.checkNotifications();

			expect(mockedNotifyFunc).toBeCalledTimes(0);

			// Next fetch
			await NotificationsService.checkNotifications();

			expect(mockedNotifyFunc).toBeCalledTimes(1);
			expect(mockedNotifyFunc).toBeCalledWith(
				expect.objectContaining({
					buttonLabel: '',
					description: '',
					title: '',
				})
			);

			expect(mockSetHasUnreadNotifications).toBeCalledTimes(2);
		});

		it('Should not show a new toast when the same notifications are fetched', async () => {
			const mockSetHasUnreadNotifications = vi.fn();
			await NotificationsService.initPolling(
				// biome-ignore lint/suspicious/noExplicitAny: Test case
				null as any,
				// biome-ignore lint/suspicious/noExplicitAny: Test case
				null as any,
				mockSetHasUnreadNotifications
			);

			const mockGetNotifications = vi.fn();
			// biome-ignore lint/suspicious/noExplicitAny: Test case
			(mockGetNotifications.mockResolvedValueOnce as any)({
				items: [mockUnreadNotification, mockReadNotification],
				total: 2,
				pages: 1,
				page: 1,
				size: 20,
			});
			// biome-ignore lint/suspicious/noExplicitAny: Test case
			(mockGetNotifications.mockResolvedValueOnce as any)({
				items: [mockUnreadNotification, mockReadNotification],
				total: 2,
				pages: 1,
				page: 1,
				size: 20,
			});
			// biome-ignore lint/suspicious/noExplicitAny: Test case
			NotificationsService.getNotifications = mockGetNotifications as any;
			// biome-ignore lint/suspicious/noExplicitAny: Test case
			const mockedNotifyFunc = vi.fn() as any;
			toastService.notify = mockedNotifyFunc;

			// Initial fetch
			await NotificationsService.checkNotifications();

			expect(mockedNotifyFunc).toBeCalledTimes(0);

			// Next fetch
			await NotificationsService.checkNotifications();

			expect(mockedNotifyFunc).toBeCalledTimes(0);

			expect(mockSetHasUnreadNotifications).toBeCalledTimes(2);
		});

		it('Should not show a new toast when a new READ notification is fetched', async () => {
			const mockSetHasUnreadNotifications = vi.fn();
			await NotificationsService.initPolling(
				// biome-ignore lint/suspicious/noExplicitAny: Test case
				null as any,
				// biome-ignore lint/suspicious/noExplicitAny: Test case
				null as any,
				mockSetHasUnreadNotifications
			);

			const mockGetNotifications = vi.fn();
			// biome-ignore lint/suspicious/noExplicitAny: Test case
			(mockGetNotifications.mockResolvedValueOnce as any)({
				items: [mockUnreadNotification, mockReadNotification],
				total: 2,
				pages: 1,
				page: 1,
				size: 20,
			});
			// biome-ignore lint/suspicious/noExplicitAny: Test case
			(mockGetNotifications.mockResolvedValueOnce as any)({
				items: [
					mockUnreadNotification,
					{
						...mockReadNotification,
						createdAt: newestDate,
						updatedAt: newestDate,
					},
					mockReadNotification,
				],
				total: 2,
				pages: 1,
				page: 1,
				size: 20,
			});
			// biome-ignore lint/suspicious/noExplicitAny: Test case
			NotificationsService.getNotifications = mockGetNotifications as any;
			// biome-ignore lint/suspicious/noExplicitAny: Test case
			const mockedNotifyFunc = vi.fn() as any;
			toastService.notify = mockedNotifyFunc;

			// Initial fetch
			await NotificationsService.checkNotifications();

			expect(mockedNotifyFunc).toBeCalledTimes(0);

			// Next fetch
			await NotificationsService.checkNotifications();

			expect(mockedNotifyFunc).toBeCalledTimes(0);

			expect(mockSetHasUnreadNotifications).toBeCalledTimes(2);
		});
	});
});
