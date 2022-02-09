import { UserSchema } from '@auth/types';

export interface UserState {
	user: UserSchema | null;
	loading: boolean;
	error: unknown | null;
}
