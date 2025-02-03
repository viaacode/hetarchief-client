import type { Avo } from '@viaa/avo2-types';

import type { User } from '@auth/types';

export interface UserState {
	user: User | null;
	commonUser: Avo.User.CommonUser | null;
	loading: boolean;
	hasCheckedLogin: boolean;
	error: unknown | null;
}
