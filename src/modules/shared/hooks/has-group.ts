import { intersection, isEmpty } from 'lodash-es';
import { useSelector } from 'react-redux';

import { GroupName } from '@account/const';
import { selectUser } from '@auth/store/user';

export const useHasAnyGroup = (...groups: GroupName[]): boolean => {
	const user = useSelector(selectUser);

	if (isEmpty(groups)) {
		return true;
	}

	if (!user) {
		return groups.includes(GroupName.ANONYMOUS);
	}

	return !isEmpty(intersection([user.groupName], groups));
};
