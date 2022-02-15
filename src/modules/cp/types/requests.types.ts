import { VisitStatus } from '@visits/types';

export enum RequestStatusAll {
	ALL = 'all',
}

export type RequestStatus = VisitStatus & RequestStatusAll;

export interface RequestTableRow extends Object {
	id: string | number;
	name: string;
	email: string;
	status: RequestStatus;
	created_at: Date;
	reason: string;
	time: string; // free-text indication of when
}
