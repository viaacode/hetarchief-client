import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { setHistory } from '@shared/store/history';

import { UseHistory } from './use-history.types';

const useHistory: UseHistory = (path, history) => {
	const dispatch = useDispatch();

	useEffect(() => {
		const newHistory = [history[history.length - 1], path];

		// Only save previous link
		dispatch(setHistory(newHistory));

		return () => {
			dispatch(setHistory(newHistory));
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [path, dispatch]);
};

export default useHistory;
