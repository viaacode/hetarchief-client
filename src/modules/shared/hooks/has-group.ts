import { GroupName } from '@account/const';
import { selectUser } from '@auth/store/user';
import { intersection, isEmpty } from 'es-toolkit/compat';
import { useSelector } from 'react-redux';

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

/**
 * The group of the current user. Users have exactly one group, and a visitor without an account
 * counts as anonymous, matching how useHasAnyGroup() treats them.
 */
export const useUserGroup = (): GroupName => {
	const user = useSelector(selectUser);
	return user?.groupName || GroupName.ANONYMOUS;
};
