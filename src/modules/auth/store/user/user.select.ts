import { AppState } from '@shared/store';

import { UserState } from './user.types';

export const selectUser = (state: AppState): UserState['user'] => state.user.user;
export const selectIsLoggedIn = (state: AppState): boolean => !!state.user.user;
export const selectHasAcceptedTos = (state: AppState): string | null =>
	state.user.user?.acceptedTosAt || null;
