import type { User } from '@auth/types';
import type { AvoUserCommonUser } from '@viaa/avo2-types';

export interface UserState {
	user: User | null;
	commonUser: AvoUserCommonUser | null;
	loading: boolean;
	hasCheckedLogin: boolean;
	error: unknown | null;
}
