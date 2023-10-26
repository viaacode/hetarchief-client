import { useSelector } from 'react-redux';

import { selectUser } from '@auth/store/user/user.select';

export const useIsKeyUser = (): boolean => {
	const user = useSelector(selectUser);

	return user?.isKeyUser || false;
};
