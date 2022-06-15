import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { selectIsScrollLocked, setLockScroll } from '@shared/store/ui';
import { findParentByClass } from '@shared/utils';

import { useScrollbarWidth } from '../use-scrollbar-width';

import { UseScrollLock } from './use-scroll-lock.types';

type scrollState = { __scrollDepth?: number };

const useScrollLock: UseScrollLock = (lock, id) => {
	// Ensure state is synced first, before any operations
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(setLockScroll({ [id]: lock }));
	}, [dispatch, lock, id]);

	/**
	 * Values
	 */

	const scrollbarWidth = useScrollbarWidth(lock);
	const isLocked = useSelector(selectIsScrollLocked);

	/**
	 * Methods
	 */

	// wrapper for window.scrollTo
	const scroll = useCallback((behavior?: ScrollBehavior) => {
		window.scrollTo({
			top: (document as unknown as scrollState).__scrollDepth,
			left: 0,
			behavior,
		});
	}, []);

	// Block wheel events outside of blade body (needed for Safari)
	const preventWheel = useCallback(
		(e?: WheelEvent) => {
			const target = e?.target as HTMLElement | null;
			const inBlade = findParentByClass('c-blade__body-wrapper', target);

			if (inBlade) {
				const { scrollHeight: total, clientHeight: size, scrollTop: depth } = inBlade;
				const goingUp = (e?.deltaY || 0) < 0;
				const goingDown = (e?.deltaY || 0) > 0;
				const atBottom = total === size + depth;

				if (goingUp || (goingDown && !atBottom)) {
					return;
				}
			}

			scroll('smooth');
			e?.stopImmediatePropagation();
		},
		[scroll]
	);

	/**
	 * Actions
	 */

	const disable = useCallback(
		(el: HTMLElement) => {
			// Use the document as a one-shot state machine
			if (!(document as unknown as scrollState).__scrollDepth) {
				(document as unknown as scrollState).__scrollDepth = window.scrollY;
			}

			el.style.overflowY = 'hidden';
			el.style.marginRight = `${scrollbarWidth}px`;
			el.style.position = 'fixed';
			el.style.width = '100vw';
			el.style.overflowX = 'hidden';
			el.style.top = `-${(document as unknown as scrollState).__scrollDepth}px`;
			window.onwheel = preventWheel;

			// Use that state to go to the right depth
			scroll();
		},
		[scrollbarWidth, scroll, preventWheel]
	);

	const enable = useCallback(
		(el: HTMLElement) => {
			el.style.overflowY = '';
			el.style.marginRight = '';
			el.style.position = 'relative';
			el.style.top = `0`;
			window.onwheel = null;

			scroll();

			// Wipe our state asynchronously once every hook instance is done
			// Known issue: when rapidly (<50ms) toggling blades, the scrollDepth is lost
			setTimeout(() => {
				delete (document as unknown as scrollState).__scrollDepth;
			}, 50);
		},
		[scroll]
	);

	/**
	 * Switch
	 */

	useEffect(() => {
		isLocked ? disable(document.body) : enable(document.body);
	}, [isLocked, disable, enable]);
};

export default useScrollLock;
