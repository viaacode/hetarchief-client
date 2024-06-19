import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { setIsStickyLayout } from '@shared/store/ui';

import { type UseStickyLayout } from './use-sticky-layout.types';

const useStickyLayout: UseStickyLayout = (isSticky = true) => {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(setIsStickyLayout(isSticky));
		return () => {
			dispatch(setIsStickyLayout(false));
		};
	}, [dispatch, isSticky]);
};

export default useStickyLayout;
