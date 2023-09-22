import { FC, ReactNode } from 'react';

import { isBrowser } from '@shared/utils';

const DisableServerSideRendering: FC<{ children?: ReactNode }> = ({ children }) => {
	return <div suppressHydrationWarning>{isBrowser() ? children : null}</div>;
};

export default DisableServerSideRendering;
