import { Avatar, Button } from '@meemoo/react-components';
import { useTranslation } from 'next-i18next';
import { FC, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Slide, ToastContainer } from 'react-toastify';

import { selectIsLoggedIn, selectUser } from '@auth/store/user';
import { Footer, Icon, Navigation, NavigationItem } from '@shared/components';
import {
	footerLeftItem,
	footerLinks,
	footerRightItem,
} from '@shared/components/Footer/__mocks__/footer';
import {
	MOCK_ITEMS_LEFT,
	MOCK_ITEMS_RIGHT,
} from '@shared/components/Navigation/__mocks__/navigation';
import { NAV_HAMBURGER_PROPS } from '@shared/const';
import { setShowAuthModal } from '@shared/store/ui';

const AppLayout: FC = ({ children }) => {
	const dispatch = useDispatch();
	const isLoggedIn = useSelector(selectIsLoggedIn);
	const user = useSelector(selectUser);
	const { t } = useTranslation();

	const rightNavItems: NavigationItem[] = useMemo(() => {
		return isLoggedIn && user
			? [
					{
						id: 'user-menu',
						node: (
							<Avatar variants="padded-y" text={`${user.firstName} ${user.lastName}`}>
								<Icon type="solid" name="user" />
							</Avatar>
						),
						children: MOCK_ITEMS_RIGHT[0].children,
					},
			  ]
			: [
					{
						id: 'auth-button',
						node: (
							<Button
								label={t(
									'modules/shared/layouts/app-layout/app-layout___inloggen-of-registreren'
								)}
								variants={['white', 'text']}
								onClick={() => dispatch(setShowAuthModal(true))}
							/>
						),
					},
			  ];
	}, [dispatch, isLoggedIn, t, user]);

	return (
		<div className="l-app">
			<Navigation>
				<Navigation.Left
					placement="left"
					renderHamburger={true}
					items={MOCK_ITEMS_LEFT}
					hamburgerProps={NAV_HAMBURGER_PROPS()}
				/>
				<Navigation.Right placement="right" items={rightNavItems} />
			</Navigation>

			<main className="l-app__main">{children}</main>

			<ToastContainer
				autoClose={5000}
				className="c-toast-container"
				toastClassName="c-toast-container__toast"
				closeButton={false}
				hideProgressBar
				position="bottom-left"
				transition={Slide}
			/>

			<Footer leftItem={footerLeftItem} links={footerLinks} rightItem={footerRightItem} />
		</div>
	);
};

export default AppLayout;
