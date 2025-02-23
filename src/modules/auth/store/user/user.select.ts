import type { AppState } from '@shared/store';
import { isServerSideRendering } from '@shared/utils/is-browser';

import type { UserState } from './user.types';

/**
 * @deprecated prefer using selectCommonUser to use a user interface that is more in line with avo
 * @param state
 */
export const selectUser = (state: AppState): UserState['user'] =>
	isServerSideRendering() ? null : state?.user?.user || null;
export const selectCommonUser = (state: AppState): UserState['commonUser'] => state.user.commonUser;
export const selectCheckLoginLoading = (state: AppState): UserState['loading'] =>
	state.user.loading;
export const selectHasCheckedLogin = (state: AppState): UserState['hasCheckedLogin'] =>
	state.user.hasCheckedLogin;
export const selectIsLoggedIn = (state: AppState): boolean => !!state.user.user;

export const selectHasAcceptedTosAt = (state: AppState): string | null => {
	return state.user.user?.acceptedTosAt || null;
};
