export enum VisitStatus {
	PENDING = 'PENDING',
	APPROVED = 'APPROVED',
	DENIED = 'DENIED',
}

export interface VisitInfo {
	id: string;
	spaceId: string;
	userProfileId: string;
	timeframe: string;
	reason: string;
	acceptedTos: boolean;
	status: VisitStatus;
	startAt?: string;
	endAt?: string;
	createdAt: string;
	updatedAt: string;
	visitorName: string;
	visitorMail: string;
	visitorId: string;
}

export interface PatchVisit {
	status: VisitStatus;
	startAt?: string;
	endAt?: string;
	remark?: string;
	denial?: string;
}
