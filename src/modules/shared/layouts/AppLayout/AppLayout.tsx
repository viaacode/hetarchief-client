import { Button } from '@meemoo/react-components';
import { useTranslation } from 'next-i18next';
import { FC, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { selectIsLoggedIn, selectUser } from '@auth/store/user';
import { Footer, Navigation, NavigationItem } from '@shared/components';
import {
	footerLeftItem,
	footerLinks,
	footerRightItem,
} from '@shared/components/Footer/__mocks__/footer';
import { MOCK_ITEMS_LEFT } from '@shared/components/Navigation/__mocks__/navigation';
import { setShowAuthModal } from '@shared/store/ui';

const AppLayout: FC = ({ children }) => {
	const dispatch = useDispatch();
	const isLoggedIn = useSelector(selectIsLoggedIn);
	const user = useSelector(selectUser);
	const { t } = useTranslation();

	const rightNavItems: NavigationItem[] = useMemo(() => {
		return isLoggedIn
			? [
					// TODO: add notification center and user dropdown menu here
					{
						id: 'user-menu',
						node: user && <span>{`${user.firstName} ${user.lastName}`}</span>,
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
					hamburgerProps={{
						hamburgerLabelOpen: 'sluit',
						hamburgerLabelClosed: 'Menu',
					}}
				/>
				<Navigation.Right placement="right" items={rightNavItems} />
			</Navigation>

			<main className="l-app__main">{children}</main>

			<Footer leftItem={footerLeftItem} links={footerLinks} rightItem={footerRightItem} />
		</div>
	);
};

export default AppLayout;
