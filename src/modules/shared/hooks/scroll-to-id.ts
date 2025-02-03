import { useEffect } from 'react';

/**
 * @deprecated waiting for elements to appear usually is quite hacky, better to wait for the network calls and then scroll when the results are rendered
 * @param id
 */
export function useScrollToId(id: string | null): void {
	const scrollDownToFocusedItem = () => {
		if (id) {
			const item = document.getElementById(id);
			if (item?.offsetTop) {
				window.scrollTo(0, item.offsetTop - 0.3 * window.innerHeight);
			} else {
				setTimeout(() => {
					scrollDownToFocusedItem();
				}, 100);
			}
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: only execute once
	useEffect(() => {
		scrollDownToFocusedItem();
	}, []);
}
