import { selectIsScrollLocked, setLockScroll } from '@shared/store/ui';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

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

	const isLocked = useSelector(selectIsScrollLocked);

	/**
	 * Switch
	 */

	useEffect(() => {
		isLocked ? disableBodyScroll(document.body) : enableBodyScroll(document.body);
	}, [isLocked]);
};

export default useScrollLock;
