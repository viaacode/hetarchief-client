import { VisitStatus } from '@visits/types';

export enum RequestStatusAll {
	ALL = 'all',
}

export interface VisitInfo {
	id: string;
	spaceId: string;
	userProfileId: string;
	timeframe: string; // free-text indication of when
	reason: string;
	acceptedTos: boolean;
	status: VisitStatus;
	startAt: string;
	endAt: string;
	createdAt: string;
	updatedAt: string;
	visitorName: string;
	visitorMail: string;
	visitorId: string;
}

export type RequestTableArgs = { row: { original: VisitInfo } };
