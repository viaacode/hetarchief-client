import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { setShowFooter } from '@shared/store/ui';

import { UseFooter } from './use-footer.types';

const useFooter: UseFooter = (showFooter = false) => {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(setShowFooter(showFooter));
		return () => {
			dispatch(setShowFooter(true));
		};
	}, [dispatch, showFooter]);
};

export default useFooter;
