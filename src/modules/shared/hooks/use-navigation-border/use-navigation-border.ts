import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { setShowNavigationbBorder } from '@shared/store/ui';

import { UseNavigationBorder } from './use-navigation-border.types';

const useNavigationBorder: UseNavigationBorder = (showBorder = true) => {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(setShowNavigationbBorder(showBorder));
		return () => {
			dispatch(setShowNavigationbBorder(false));
		};
	}, [dispatch, showBorder]);
};

export default useNavigationBorder;
