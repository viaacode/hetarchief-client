import { selectIsScrollLocked, setLockScroll } from '@shared/store/ui';
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
		if (isLocked) {
			document.body.classList.add('global-scroll-block');
		} else {
			document.body.classList.remove('global-scroll-block');
		}
	}, [isLocked]);
};

export default useScrollLock;
