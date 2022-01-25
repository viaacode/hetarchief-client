import { Button } from '@meemoo/react-components';
import { useTranslation } from 'next-i18next';
import { FC, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { Footer, Navigation, NavigationItem } from '@shared/components';
import {
	footerLeftItem,
	footerLinks,
	footerRightItem,
} from '@shared/components/Footer/__mocks__/footer';
import { MOCK_ITEMS_LEFT } from '@shared/components/Navigation/__mocks__/navigation';
import { setShowAuthModal } from '@shared/store/ui';

const AppLayout: FC = ({ children }) => {
	// TODO: replace with actual logged in state
	const isLoggedIn = false;
	const dispatch = useDispatch();
	const { t } = useTranslation();

	const rightNavItems: NavigationItem[] = useMemo(() => {
		return isLoggedIn
			? [
					// TODO: add notification center and user dropdown menu here
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
	}, [dispatch, isLoggedIn, t]);

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
