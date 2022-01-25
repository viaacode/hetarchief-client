export type UserSchema = Record<string, unknown> | null;

export interface UserState {
	// TODO: add user typings from proxy
	user: UserSchema;
}
