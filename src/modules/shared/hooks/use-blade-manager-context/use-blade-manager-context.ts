import { useContext } from 'react';

import BladeManagerContext from '@shared/context/BladeManagerContext/BladeManagerContext';

import { UseBladeManagerContext } from './use-blade-manager-context.types';

const useBladeManagerContext: UseBladeManagerContext = () => {
	const bladeManagerContext = useContext(BladeManagerContext);

	return bladeManagerContext;
};

export default useBladeManagerContext;
