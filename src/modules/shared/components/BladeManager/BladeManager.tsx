import { BladeManagerContext } from '@shared/context/BladeManagerContext';
import { useScrollLock } from '@shared/hooks/use-scroll-lock';
import type { FC } from 'react';
import { useCallback, useState } from 'react';

import type { BladeManagerProps } from './BladeManager.types';

const BladeManager: FC<BladeManagerProps> = ({
	children,
	currentLayer,
	opacityStep = 0.1,
	onCloseBlade = () => null,
}) => {
	useScrollLock(currentLayer > 0, 'BladeManager');

	const [bladeWidths, setBladeWidths] = useState<Record<number, boolean>>({});

	const registerBladeWidth = useCallback((layer: number, isWide: boolean) => {
		setBladeWidths((prev) => {
			if (prev[layer] === isWide) return prev;
			return { ...prev, [layer]: isWide };
		});
	}, []);

	return (
		<BladeManagerContext.Provider
			value={{
				isManaged: true,
				currentLayer,
				opacityStep,
				onCloseBlade,
				bladeWidths,
				registerBladeWidth,
			}}
		>
			{children}
		</BladeManagerContext.Provider>
	);
};

export default BladeManager;
