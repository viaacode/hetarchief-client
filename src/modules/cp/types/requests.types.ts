import { RequestStatus } from '@cp/const/requests.const';

export interface RequestTableRow extends Object {
	name: string;
	email: string;
	status: RequestStatus;
	created_at: Date;
}
