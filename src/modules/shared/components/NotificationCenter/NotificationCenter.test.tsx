import { fireEvent, render } from '@testing-library/react';

import reactI18nextMock from '../../../../__mocks__/react-i18next';

import NotificationCenter from './NotificationCenter';
import { NotificationCenterProps } from './NotificationCenter.types';
import { notificationCenterMock, notificationsMock } from './__mocks__/notification-center';

reactI18nextMock.mock('react-i18next');

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

			const notifications = queryAllByText(notificationCenterMock.notifications[0].title);

			expect(notifications).toHaveLength(notificationCenterMock.notifications.length);
		});
		it('Should render translations', () => {
			const readTitle = 'Gelezen';
			const { queryByText } = renderNotificationCenter({
				notifications: [{ title: readTitle, description: '', read: true, id: '123' }],
			});

			const notificationTitle = queryByText(readTitle);

			expect(notificationTitle).toBeInTheDocument();
		});
		it('Should render unread and read notifications', () => {
			const { queryAllByText } = renderNotificationCenter({
				notifications: notificationsMock,
			});

			const notifications = queryAllByText(notificationsMock[0].title);

			expect(notifications[0].parentElement).toHaveClass(
				'c-notification-center__notification--unread'
			);
			expect(notifications[1].parentElement).toHaveClass(
				'c-notification-center__notification--read'
			);
		});
		it('Should call onClickNotification when a notification check has been clicked', () => {
			const onClickNotification = jest.fn();
			const { queryAllByText } = renderNotificationCenter({
				notifications: notificationsMock,
				onClickNotification,
			});

			const notificationButton = queryAllByText(
				notificationsMock[0].title
			)[0].parentElement.querySelector('.c-button');

			fireEvent.click(notificationButton);

			expect(onClickNotification).toHaveBeenCalled();
			expect(onClickNotification).toHaveBeenCalledTimes(1);
			expect(onClickNotification).toHaveBeenCalledWith(notificationsMock[0].id);
		});
		it('Should call onClickButton when the footer button has been clicked', () => {
			const onClickButton = jest.fn();
			const { container } = renderNotificationCenter({
				onClickButton,
			});

			const button = container.querySelector('.c-notification-center__button');

			fireEvent.click(button);

			expect(onClickButton).toHaveBeenCalled();
			expect(onClickButton).toHaveBeenCalledTimes(1);
		});
	});
});
