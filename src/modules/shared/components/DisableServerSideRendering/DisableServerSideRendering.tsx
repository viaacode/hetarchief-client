import { FC } from 'react';

import { isBrowser } from '@shared/utils';

const DisableServerSideRendering: FC = ({ children }) => {
	return <div suppressHydrationWarning>{isBrowser() ? children : null}</div>;
};

export default DisableServerSideRendering;
