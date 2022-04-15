export enum Idp {
	HETARCHIEF = 'HETARCHIEF',
	MEEMOO = 'MEEMOO',
}

export interface User {
	email: string;
	firstName: string;
	id: string;
	lastName: string;
	acceptedTosAt: string | null;
	idp: Idp;
	groupName: string;
}
