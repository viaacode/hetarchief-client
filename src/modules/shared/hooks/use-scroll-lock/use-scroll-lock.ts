import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { selectIsScrollLocked, setLockScroll } from '@shared/store/ui';
import { findParentByClass } from '@shared/utils';

import { useScrollbarWidth } from '../use-scrollbar-width';

import { UseScrollLock } from './use-scroll-lock.types';

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
	const scroll = (y?: string, behavior?: ScrollBehavior) => {
		const parsed = parseInt(y || '0');
		window.scrollTo({
			top: parsed,
			left: 0,
			behavior,
		});
	};

	// Block wheel events outside of blade body (needed for Safari)
	const preventWheel = useCallback((e?: WheelEvent) => {
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

		scroll(document.body.dataset.depth, 'smooth');
		e?.preventDefault();
	}, []);

	/**
	 * Actions
	 */

	const disable = useCallback(
		(el: HTMLElement) => {
			// Use the element as a one-shot state machine
			if (!el.dataset.depth) {
				el.dataset.depth = `${window.scrollY}`;
			}

			el.style.overflowY = 'hidden';
			el.style.marginRight = `${scrollbarWidth}px`;
			window.onwheel = preventWheel;

			// Use that state to go to the right depth
			scroll(el.dataset.depth);
		},
		[scrollbarWidth, preventWheel]
	);

	const enable = useCallback((el: HTMLElement) => {
		el.style.overflowY = '';
		el.style.marginRight = '';
		window.onwheel = null;

		scroll(el.dataset.depth);

		// Wipe our state once we're done
		el.removeAttribute('data-depth');
	}, []);

	/**
	 * Switch
	 */

	useEffect(() => {
		isLocked ? disable(document.body) : enable(document.body);
	}, [isLocked, disable, enable]);
};

export default useScrollLock;
