import { FC } from 'react';

import { BladeManagerContext } from '@shared/context/BladeManagerContext';
import { useScrollLock } from '@shared/hooks';
import { isBrowser } from '@shared/utils';

import { BladeManagerProps } from './BladeManager.types';

const BladeManager: FC<BladeManagerProps> = ({ children, currentLayer, opacityStep = 0.1 }) => {
	useScrollLock(isBrowser() ? document.body : null, currentLayer > 0);

	return (
		<BladeManagerContext.Provider
			value={{ isManaged: true, currentLayer: currentLayer, opacityStep: opacityStep }}
		>
			{children}
		</BladeManagerContext.Provider>
	);
};

export default BladeManager;
