import { useCallback, useEffect } from 'react';

import { useScrollbarWidth } from '../use-scrollbar-width';

import { UseScrollLock } from './use-scroll-lock.types';

const useScrollLock: UseScrollLock = (lock) => {
	const scrollbarWidth = useScrollbarWidth(lock);

	// This function makes sure we're on the same height before and after lock
	const scroll = (y?: string) => {
		const parsed = parseInt(y || '0');
		parsed > 0 && window.scrollTo(0, parsed);
	};

	const disable = useCallback(
		(el: HTMLElement) => {
			// Use the element as a one-shot state machine
			if (!el.dataset.depth) {
				el.dataset.depth = `${window.scrollY}`;
			}

			el.style.overflowY = 'hidden';
			el.style.marginRight = `${scrollbarWidth}px`;

			// Use that state to go to the right depth
			scroll(el.dataset.depth);
		},
		[scrollbarWidth]
	);

	const restore = useCallback((el: HTMLElement) => {
		el.style.overflowY = '';
		el.style.marginRight = '';

		scroll(el.dataset.depth);

		// Wipe our state once we're done
		el.removeAttribute('data-depth');
	}, []);

	useEffect(() => {
		lock ? disable(document.body) : restore(document.body);
	}, [lock, disable, restore]);
};

export default useScrollLock;
