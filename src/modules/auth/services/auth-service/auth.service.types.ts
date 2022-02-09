import { UserSchema } from '@auth/types';

export enum AuthMessage {
	LoggedIn = 'LOGGED_IN',
	LoggedOut = 'LOGGED_OUT',
}

interface CheckLoginSuccess {
	userInfo?: UserSchema;
	message: AuthMessage;
}

export type CheckLoginResponse = CheckLoginSuccess | undefined;
