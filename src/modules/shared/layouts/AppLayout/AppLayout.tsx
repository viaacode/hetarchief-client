import { FC } from 'react';

import { Footer, Navigation } from '@shared/components';
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
				<Navigation.Right placement="right" items={MOCK_ITEMS_RIGHT} />
			</Navigation>

			<main className="l-app__main">{children}</main>

			<Footer leftItem={footerLeftItem} links={footerLinks} rightItem={footerRightItem} />
		</div>
	);
};

export default AppLayout;
