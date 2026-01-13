import { selectUser } from '@auth/store/user';
import { useSelector } from 'react-redux';

export const useIsEvaluator = (): boolean => {
	const user = useSelector(selectUser);

	return user?.isEvaluator || false;
};
