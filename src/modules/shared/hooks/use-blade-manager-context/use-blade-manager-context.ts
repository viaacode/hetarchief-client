import { useContext } from 'react';

import { BladeManagerContextValue } from '@shared/context/BladeManagerContext';
import BladeManagerContext from '@shared/context/BladeManagerContext/BladeManagerContext';

export const useBladeManagerContext = (): BladeManagerContextValue => {
	return useContext(BladeManagerContext);
};
