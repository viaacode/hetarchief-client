import { intersection, isEmpty } from 'lodash-es';
import { useSelector } from 'react-redux';

import { Group } from '@account/const';
import { selectUser } from '@auth/store/user';

export const useHasAnyGroup = (...groups: Group[]): boolean => {
	const user = useSelector(selectUser);

	if (isEmpty(groups)) {
		return true;
	}

	if (!user) {
		return false;
	}

	return !isEmpty(intersection([user.groupName], groups));
};
