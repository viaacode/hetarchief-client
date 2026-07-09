import { selectUser } from '@auth/store/user';
import { useSelector } from 'react-redux';

export const useIsKeyUser = (): boolean => {
	const user = useSelector(selectUser);

	return user?.isKeyUser || false;
};
