import { type RefObject, useEffect, useLayoutEffect } from 'react';

/**
 * Custom hook to observe size changes of an element and call a callback with the new size.
 * @param ref the element to observe
 * @param onResize the callback to call when the observed element's size changes
 * @param subProperty optional sub-property of the element to observe (e.g., for nested elements under a library object. Scrollbar._container)
 */
export function useSize<T extends HTMLElement>(
	ref: RefObject<T>,
	onResize: (element: HTMLElement) => void,
	subProperty?: string
) {
	useLayoutEffect(() => {
		if (ref.current) {
			if (subProperty) {
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				onResize((ref.current as any)[subProperty] as HTMLElement);
			} else {
				onResize(ref.current);
			}
		}
	}, [ref, onResize, subProperty]);

	useEffect(() => {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const element = subProperty ? ((ref.current as any)[subProperty] as HTMLElement) : ref.current;
		if (!element) return;
		const resizeObserver = new ResizeObserver(() => onResize(element));
		resizeObserver.observe(element);
		return () => resizeObserver.disconnect();
	}, [ref, onResize, subProperty]);
}
