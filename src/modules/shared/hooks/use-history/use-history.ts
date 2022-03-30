import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { selectHistory, setHistory } from '@shared/store/history';

import { UseHistory } from './use-history.types';

const useHistory: UseHistory = () => {
	const dispatch = useDispatch();
	const { asPath } = useRouter();
	const history = useSelector(selectHistory);

	useEffect(() => {
		// Only save previous link
		dispatch(setHistory([history[history.length - 1], asPath]));

		return () => {
			dispatch(setHistory([history[history.length - 1], asPath]));
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [asPath]);
};

export default useHistory;
