import { RequestStatus } from '@cp/const/requests.const';

export interface RequestTableRow extends Object {
	id: string | number;
	name: string;
	email: string;
	status: RequestStatus;
	created_at: Date;
	reason: string;
	time: string; // free-text indication of when
}
