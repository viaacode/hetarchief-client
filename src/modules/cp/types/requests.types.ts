export const enum RequestStatus {
	all = 'all',
	open = 'open',
	approved = 'approved',
	denied = 'denied',
}

export interface RequestTableRow extends Object {
	id: string | number;
	name: string;
	email: string;
	status: RequestStatus;
	created_at: Date;
	reason: string;
	time: string; // free-text indication of when
}
