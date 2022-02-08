import { AppState } from '@shared/store';

import { UserState } from './user.types';

export const selectUser = (state: AppState): UserState['user'] => state.user.user;
export const selectIsLoggedIn = (state: AppState): boolean => !!state.user.user;
