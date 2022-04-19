export enum Idp {
	HETARCHIEF = 'HETARCHIEF',
	MEEMOO = 'MEEMOO',
}

export interface User {
	acceptedTosAt: string | null;
	email: string;
	firstName: string;
	lastName: string;
	fullName: string;
	groupId: string;
	groupName: string;
	id: string;
	idp: Idp;
	maintainerId: string | null;
	visitorSpaceSlug?: string;
	permissions: string[];
}
