import { AppState } from '@shared/store';

import { UserState } from './user.types';

export const selectUser = (state: AppState): UserState['user'] => state.user.user;
export const selectUserProfileId = (state: AppState): string | null =>
	state.user.user ? state.user.user.id : null;
export const selectIsLoggedIn = (state: AppState): boolean => !!state.user.user;

export const selectHasAcceptedTosAt = (state: AppState): string | null => {
	return state.user.user?.acceptedTosAt || null;
};
