import { render } from '@testing-library/react';

import NotificationCenter from './NotificationCenter';
import { NotificationCenterProps } from './NotificationCenter.types';
import { notificationCenterMock, NOTIFICATIONS_FIRST_PAGE } from './__mocks__/notification-center';

const renderNotificationCenter = (args: Partial<NotificationCenterProps>) => {
	return render(<NotificationCenter {...notificationCenterMock} {...args} />);
};

describe('Components', () => {
	describe('<NotificationCenter />', () => {
		it('Should render notification center', () => {
			const { container } = renderNotificationCenter({});

			expect(container).toBeInTheDocument();
		});
		it('Should render notifications', () => {
			const { queryAllByText } = renderNotificationCenter({});

			const notifications = queryAllByText(NOTIFICATIONS_FIRST_PAGE.items[0].title);

			expect(notifications).toHaveLength(NOTIFICATIONS_FIRST_PAGE.items.length);
		});
		it('Should render translations', () => {
			const readTitle = 'Gelezen';
			const { queryByText } = renderNotificationCenter(notificationCenterMock);

			const notificationTitle = queryByText(readTitle);

			expect(notificationTitle).toBeInTheDocument();
		});
		it('Should render unread and read notifications', () => {
			const { queryAllByText } = renderNotificationCenter(notificationCenterMock);

			const notifications = queryAllByText(NOTIFICATIONS_FIRST_PAGE.items[0].title);

			expect(notifications[0].parentElement).toHaveClass(
				'c-notification-center__notification--unread'
			);
			expect(notifications[19].parentElement).toHaveClass(
				'c-notification-center__notification--read'
			);
		});
	});
});
