import { WindowSizeContext } from '@shared/context/WindowSizeContext';
import { useContext } from 'react';

import type { UseWindowSizeContext } from './use-window-size-context.types';

const useWindowSizeContext: UseWindowSizeContext = () => {
	const windowSizeContext = useContext(WindowSizeContext);

	return windowSizeContext;
};

export default useWindowSizeContext;
