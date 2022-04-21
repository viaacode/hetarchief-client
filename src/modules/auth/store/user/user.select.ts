import { Permission } from '@account/const';
import { AppState } from '@shared/store';

import { UserState } from './user.types';

export const selectUser = (state: AppState): UserState['user'] => state.user.user;
export const selectIsLoggedIn = (state: AppState): boolean => !!state.user.user;

export const selectHasAcceptedTosAt = (state: AppState): string | null => {
	return state.user.user?.acceptedTosAt || null;
};

export const selectHasPermission = (state: AppState, permission: Permission): boolean => {
	return !!state.user.user?.permissions.includes(permission);
};
