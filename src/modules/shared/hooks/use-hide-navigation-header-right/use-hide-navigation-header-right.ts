import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { setShowNavigationHeaderRight } from '@shared/store/ui';

import type { UseHideNavigationHeaderRight } from './use-hide-navigation-header-right.types';

const useHideNavigationHeaderRight: UseHideNavigationHeaderRight = (showNavRight = false) => {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(setShowNavigationHeaderRight(showNavRight));
		return () => {
			dispatch(setShowNavigationHeaderRight(true));
		};
	}, [dispatch, showNavRight]);
};

export default useHideNavigationHeaderRight;
