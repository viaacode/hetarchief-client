import { selectIsScrollLocked, setLockScroll } from '@shared/store/ui';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useScrollbarWidth } from '../use-scrollbar-width';

import type { UseScrollLock } from './use-scroll-lock.types';

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
	 * Actions
	 */

	const disable = useCallback(
		(el: HTMLElement) => {
			el.style.overflow = 'hidden';
			el.style.marginRight = `${scrollbarWidth}px`;
		},
		[scrollbarWidth]
	);

	const enable = useCallback((el: HTMLElement) => {
		el.style.overflow = '';
		el.style.marginRight = '';
	}, []);

	/**
	 * Switch
	 */

	useEffect(() => {
		isLocked ? disable(document.body) : enable(document.body);
	}, [isLocked, disable, enable]);
};

export default useScrollLock;
