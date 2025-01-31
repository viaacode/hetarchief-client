import { useEffect, useState } from 'react';

// Based on https://pineco.de/snippets/get-the-width-of-scrollbar-using-javascript/

const useScrollbarWidth = (trigger: boolean): number => {
	const [scrollbarWidth, setScrollbarWidth] = useState(0);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		setScrollbarWidth(window.innerWidth - document.documentElement.clientWidth);
	}, [trigger]);

	return scrollbarWidth;
};

export default useScrollbarWidth;
