import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import { FC, useState } from 'react';

import {
	Footer,
	Icon,
	Navigation,
	NotificationCenter,
	notificationCenterMock,
} from '@shared/components';
import {
	footerLeftItem,
	footerLinks,
	footerRightItem,
} from '@shared/components/Footer/__mocks__/footer';
import {
	MOCK_ITEMS_LEFT,
	MOCK_ITEMS_RIGHT,
} from '@shared/components/Navigation/__mocks__/navigation';

const AppLayout: FC = ({ children }) => {
	const [notificationsOpen, setNotificationsOpen] = useState(false);

	const anyUnreadNotifications = notificationCenterMock.notifications.some(
		(notification) => notification.read === false
	);

	const notificationButton = {
		node: (
			<Button
				onClick={() => setNotificationsOpen(!notificationsOpen)}
				variants="text"
				className={clsx(
					notificationsOpen ? 'u-color-teal' : 'u-color-white',
					`c-navigation__notifications-badge--${notificationsOpen ? 'white' : 'teal'}`,
					{
						['c-navigation__notifications-badge']: anyUnreadNotifications,
					}
				)}
				icon={<Icon type="solid" name="notification" />}
			/>
		),
		id: 'notifications',
	};
	return (
		<div className="l-app">
			<Navigation>
				<Navigation.Left
					placement="left"
					renderHamburger={true}
					items={MOCK_ITEMS_LEFT}
					hamburgerProps={{
						hamburgerLabelOpen: 'sluit',
						hamburgerLabelClosed: 'Menu',
					}}
				/>
				<Navigation.Right
					placement="right"
					items={[notificationButton, ...MOCK_ITEMS_RIGHT]}
				/>
			</Navigation>

			<main className="l-app__main">
				<>
					{children}
					<NotificationCenter
						{...notificationCenterMock}
						isOpen={notificationsOpen}
						onClose={() => setNotificationsOpen(false)}
					/>
				</>
			</main>
			<Footer leftItem={footerLeftItem} links={footerLinks} rightItem={footerRightItem} />
		</div>
	);
};

export default AppLayout;
