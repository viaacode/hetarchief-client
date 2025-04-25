import { useEffect, useState } from 'react';

import type { UseWindowSize, WindowSizeState } from './use-window-size.types';

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

			// Calculate real view height to adjust when ipad resizes their browser chrome
			document.documentElement.style.setProperty('--vh', `${window.innerHeight}px`);
		};

		window.addEventListener('resize', handleResize);
		handleResize();

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	return windowSize;
};

export default useWindowSize;
