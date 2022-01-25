import { fireEvent, queryByText, render } from '@testing-library/react';

import NotificationCenter from './NotificationCenter';
import { notificationCenterMock } from './__mocks__/notificationCenter';

const renderNotificationCenter = (args) => {
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
			const unreadTitle = 'Ongelezen';
			const buttonTitle = 'Markeer alles als gelezen';
			const { queryByText } = renderNotificationCenter({
				readTitle,
				unreadTitle,
				buttonTitle,
			});

			const notificationTitle = queryByText(readTitle);
			const notificationUnreadTitle = queryByText(unreadTitle);
			const notificationButtonTitle = queryByText(buttonTitle);

			expect(notificationTitle).toBeInTheDocument();
			expect(notificationUnreadTitle).toBeInTheDocument();
			expect(notificationButtonTitle).toBeInTheDocument();
		});
		it('Should render unread and read notifications', () => {
			const notificationsMock = [
				{
					title: 'Aanvraag goedgekeurd',
					description:
						'Jouw aanvraag coor Leeszaal 6 is goedgekeurd. Je hebt toegang t.e.m. 12 augustus 2021, 17:00.',
					read: false,
					id: 'aanvraag - leeszaal 6 - 12 augustus',
				},
				{
					title: 'Aanvraag goedgekeurd',
					description:
						'Jouw aanvraag coor Leeszaal 6 is goedgekeurd. Je hebt toegang t.e.m. 12 augustus 2021, 17:00.',
					read: true,
					id: 'aanvraag - leeszaal 6 - 12 augustus',
				},
			];
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
			const notificationsMock = [
				{
					title: 'Aanvraag goedgekeurd',
					description:
						'Jouw aanvraag coor Leeszaal 6 is goedgekeurd. Je hebt toegang t.e.m. 12 augustus 2021, 17:00.',
					read: false,
					id: 'aanvraag - leeszaal 6 - 12 augustus',
				},
			];
			const onClickNotification = jest.fn();
			const { queryByText } = renderNotificationCenter({
				notifications: notificationsMock,
				onClickNotification,
			});

			const notificationButton = queryByText(
				notificationsMock[0].title
			).parentElement.querySelector('.c-button');

			fireEvent.click(notificationButton);

			expect(onClickNotification).toHaveBeenCalled();
			expect(onClickNotification).toHaveBeenCalledTimes(1);
			expect(onClickNotification).toHaveBeenCalledWith(notificationsMock[0].id);
		});
		it('Should call onClickButton when the footer button has been clicked', () => {
			const onClickButton = jest.fn();
			const { queryByText } = renderNotificationCenter({
				onClickButton,
			});

			const button = queryByText(notificationCenterMock.buttonTitle);

			fireEvent.click(button);

			expect(onClickButton).toHaveBeenCalled();
			expect(onClickButton).toHaveBeenCalledTimes(1);
		});
	});
});
