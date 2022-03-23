import { debounce } from 'lodash';
import { useEffect, useState } from 'react';

import { UseWindowSize, WindowSizeState } from './use-window-size.types';

export const WINDOW_RESIZE_TIMEOUT = 300;

const useWindowSize: UseWindowSize = () => {
	// Initialize state with undefined width/height so server and client renders match
	// Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
	const [windowSize, setWindowSize] = useState<WindowSizeState>({
		width: undefined,
		height: undefined,
	});

	useEffect(() => {
		const handleResize = () => {
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		};
		const debouncedResize = debounce(handleResize, WINDOW_RESIZE_TIMEOUT);

		window.addEventListener('resize', debouncedResize);
		handleResize();

		return () => {
			window.removeEventListener('resize', debouncedResize);
		};
	}, []);

	return windowSize;
};

export default useWindowSize;
