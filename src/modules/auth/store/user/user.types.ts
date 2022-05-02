import { User } from '@auth/types';

export interface UserState {
	user: User | null;
	loading: boolean;
	hasCheckedLogin: boolean;
	error: unknown | null;
}
