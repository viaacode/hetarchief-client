import type { BladeManagerContextValue } from '@shared/context/BladeManagerContext';
import BladeManagerContext from '@shared/context/BladeManagerContext/BladeManagerContext';
import { useContext } from 'react';

export const useBladeManagerContext = (): BladeManagerContextValue => {
	return useContext(BladeManagerContext);
};
