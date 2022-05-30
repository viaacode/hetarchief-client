import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

import { mockStore } from '../../../../__mocks__/store';

import NotificationCenter from './NotificationCenter';
import { NotificationCenterProps } from './NotificationCenter.types';
import { notificationCenterMock, NOTIFICATIONS_FIRST_PAGE } from './__mocks__/notification-center';

const renderNotificationCenter = (args: Partial<NotificationCenterProps>) => {
	return render(
		<Provider store={mockStore}>
			<NotificationCenter {...notificationCenterMock} {...args} />
		</Provider>
	);
};

describe('Components', () => {
	describe('<NotificationCenter />', () => {
		it('Should render notification center', () => {
			const { container } = renderNotificationCenter({});

			expect(container).toBeInTheDocument();
		});
		it('Should render notifications', () => {
			const { queryAllByText } = renderNotificationCenter({});

			const notifications = queryAllByText(NOTIFICATIONS_FIRST_PAGE.items[0].description);

			expect(notifications).toHaveLength(NOTIFICATIONS_FIRST_PAGE.items.length);
		});
		// TODO re-enable these using the reworked notification center styles/structure
		// it('Should render notification link to reading room', () => {
		// 	const { queryAllByText } = renderNotificationCenter({});
		//
		// 	const notificationLink = queryAllByText(
		// 		NOTIFICATIONS_FIRST_PAGE.items[0].description
		// 	)[0];
		//
		// 	expect(notificationLink).toHaveAttribute(
		// 		'href',
		// 		'/beheer/aanvragen?visitRequest=' + NOTIFICATIONS_FIRST_PAGE.items[0].visitId
		// 	);
		// });
		// it('Should render unread and read notifications', () => {
		// 	const { queryAllByText } = renderNotificationCenter(notificationCenterMock);
		//
		// 	const notifications = queryAllByText(NOTIFICATIONS_FIRST_PAGE.items[0].description);
		//
		// 	expect(notifications[0].parentElement?.parentElement).toHaveClass(
		// 		'c-notification-center__notification--unread'
		// 	);
		// 	expect(notifications[19].parentElement?.parentElement).toHaveClass(
		// 		'c-notification-center__notification--read'
		// 	);
		// });
	});
});
