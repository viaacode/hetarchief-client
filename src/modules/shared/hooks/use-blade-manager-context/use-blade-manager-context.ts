import { useContext } from 'react';

import { type BladeManagerContextValue } from '@shared/context/BladeManagerContext';
import BladeManagerContext from '@shared/context/BladeManagerContext/BladeManagerContext';

export const useBladeManagerContext = (): BladeManagerContextValue => {
	return useContext(BladeManagerContext);
};
