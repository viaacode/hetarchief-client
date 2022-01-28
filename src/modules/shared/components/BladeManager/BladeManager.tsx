import { FC } from 'react';

import { BladeManagerContext } from '@shared/context/BladeManagerContext';
import { useScrollLock } from '@shared/hooks';

import { BladeManagerProps } from './BladeManager.types';

const BladeManager: FC<BladeManagerProps> = ({
	children,
	currentLayer,
	opacityStep = 0.1,
	onCloseBlade = () => null,
}) => {
	useScrollLock(currentLayer > 0);

	return (
		<BladeManagerContext.Provider
			value={{ isManaged: true, currentLayer, opacityStep, onCloseBlade }}
		>
			{children}
		</BladeManagerContext.Provider>
	);
};

export default BladeManager;
