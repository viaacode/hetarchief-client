import type { User } from '@auth/types';
import type { AvoUserCommonUser } from '@viaa/avo2-types';

export enum AuthMessage {
	LoggedIn = 'LOGGED_IN',
	LoggedOut = 'LOGGED_OUT',
}

interface CheckLoginSuccess {
	userInfo?: User;
	commonUserInfo?: AvoUserCommonUser;
	message: AuthMessage;
}

export type CheckLoginResponse = CheckLoginSuccess | undefined;
