import { AppState } from '@shared/store';

import { UserState } from './user.types';

export const selectUser = (state: AppState): UserState['user'] => state.user.user;
export const selectCheckLoginLoading = (state: AppState): UserState['loading'] =>
	state.user.loading;
export const selectHasCheckedLogin = (state: AppState): UserState['hasCheckedLogin'] =>
	state.user.hasCheckedLogin;
export const selectIsLoggedIn = (state: AppState): boolean => !!state.user.user;

export const selectHasAcceptedTosAt = (state: AppState): string | null => {
	return state.user.user?.acceptedTosAt || null;
};
