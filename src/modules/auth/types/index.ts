import { GroupName, Permission } from '@account/const';

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
	groupName: GroupName;
	id: string;
	idp: Idp;
	maintainerId: string | null;
	organisationName: string | null;
	visitorSpaceSlug?: string;
	permissions: Permission[];
	isKeyUser: boolean;
}
