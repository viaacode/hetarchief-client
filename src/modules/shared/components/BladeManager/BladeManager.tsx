import { FC } from 'react';

import { BladeManagerProps } from './BladeManager.types';

const BladeManager: FC<BladeManagerProps> = ({ children }) => {
	return <>{children}</>;
};

export default BladeManager;
