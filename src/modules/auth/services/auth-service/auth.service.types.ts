import { User } from '@auth/types';

export enum AuthMessage {
	LoggedIn = 'LOGGED_IN',
	LoggedOut = 'LOGGED_OUT',
}

interface CheckLoginSuccess {
	userInfo?: User;
	message: AuthMessage;
}

export type CheckLoginResponse = CheckLoginSuccess | undefined;
