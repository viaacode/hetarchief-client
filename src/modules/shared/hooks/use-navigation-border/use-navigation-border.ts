import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { setShowNavigationBorder } from '@shared/store/ui';

import { UseNavigationBorder } from './use-navigation-border.types';

const useNavigationBorder: UseNavigationBorder = (showBorder = true) => {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(setShowNavigationBorder(showBorder));
		return () => {
			dispatch(setShowNavigationBorder(false));
		};
	}, [dispatch, showBorder]);
};

export default useNavigationBorder;
