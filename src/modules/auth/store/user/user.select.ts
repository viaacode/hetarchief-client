import { AppState } from '@shared/store';

import { UserSchema } from './user.types';

export const selectUser = (state: AppState): UserSchema => state.user.user;
export const selectIsLoggedIn = (state: AppState): boolean => !!state.user.user;
