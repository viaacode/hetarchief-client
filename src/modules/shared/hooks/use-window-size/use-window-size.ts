import debounce from 'lodash.debounce';
import { useEffect, useState } from 'react';

import { isBrowser } from '@shared/utils';

import { UseWindowSize, WindowSizeState } from './use-window-size.types';

const useWindowSize: UseWindowSize = () => {
	// Initialize state with undefined width/height so server and client renders match
	// Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
	const [windowSize, setWindowSize] = useState<WindowSizeState>({
		width: undefined,
		height: undefined,
	});

	useEffect(() => {
		if (!isBrowser()) {
			return;
		}

		const handleResize = () => {
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		};
		const debouncedResize = debounce(handleResize, 100);

		window.addEventListener('resize', debouncedResize);
		handleResize();

		return () => {
			window.removeEventListener('resize', debouncedResize);
		};
	}, []);

	return windowSize;
};

export default useWindowSize;
