import { Avo } from '@viaa/avo2-types';

import { User } from '@auth/types';

export enum AuthMessage {
	LoggedIn = 'LOGGED_IN',
	LoggedOut = 'LOGGED_OUT',
}

interface CheckLoginSuccess {
	userInfo?: User;
	commonUserInfo?: Avo.User.CommonUser;
	message: AuthMessage;
}

export type CheckLoginResponse = CheckLoginSuccess | undefined;
