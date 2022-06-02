import { debounce } from 'lodash-es';
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

			// Set custom vh css var to exclude browser ui on mobile
			const vh = window.innerHeight * 0.01;
			document.documentElement.style.setProperty('--vh', `${vh}px`);
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
