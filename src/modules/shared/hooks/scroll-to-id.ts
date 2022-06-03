import { useEffect } from 'react';

export function useScrollToId(id: string | null): void {
	const scrollDownToFocusedItem = () => {
		if (id) {
			const item = document.getElementById(id);
			if (item && item.offsetTop) {
				window.scrollTo(0, item.offsetTop - 0.4 * window.innerHeight);
			} else {
				setTimeout(() => {
					scrollDownToFocusedItem();
				}, 100);
			}
		}
	};

	useEffect(() => {
		scrollDownToFocusedItem();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
}
