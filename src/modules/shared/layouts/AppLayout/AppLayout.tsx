import { FC } from 'react';

import { Navigation } from '@shared/components';
import { MOCK_ITEMS_LEFT, MOCK_ITEMS_RIGHT } from '@shared/components/Navigation/__mocks__';

const AppLayout: FC = ({ children }) => {
	return (
		<div className="l-app">
			<Navigation>
				<Navigation.Left items={MOCK_ITEMS_LEFT} />
				<Navigation.Right items={MOCK_ITEMS_RIGHT} />
			</Navigation>

			<main className="l-app__main">{children}</main>
		</div>
	);
};

export default AppLayout;
