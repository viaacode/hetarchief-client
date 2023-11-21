import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { setShowFooter } from '@shared/store/ui';

import { UseHideFooter } from './use-hide-footer.types';

const useHideFooter: UseHideFooter = (showFooter = false) => {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(setShowFooter(showFooter));
		return () => {
			dispatch(setShowFooter(true));
		};
	}, [dispatch, showFooter]);
};

export default useHideFooter;
