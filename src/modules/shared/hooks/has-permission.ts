import { intersection } from 'lodash-es';
import { useSelector } from 'react-redux';

import { Permission } from '@account/const';
import { selectUser } from '@auth/store/user';

/**
 * Checks that the user has all permissions listed
 * @param permissions the permissions that the user should all have
 */
export const useHasAllPermission = (...permissions: Permission[]): boolean => {
	const user = useSelector(selectUser);

	if (permissions?.length === 0) {
		// If no permissions are required, then the user as access
		return true;
	}
	if (!user) {
		return false;
	}
	return intersection(user.permissions, permissions).length === permissions.length;
};

/**
 * Checks that the user has all permissions listed
 * @param permissions the permissions of which the user needs to at least have one
 */
export const useHasAnyPermission = (...permissions: Permission[]): boolean => {
	const user = useSelector(selectUser);

	if (permissions?.length === 0) {
		// If no permissions are required, then the user as access
		return true;
	}
	if (!user) {
		return false;
	}
	return intersection(user.permissions, permissions).length >= 1;
};
