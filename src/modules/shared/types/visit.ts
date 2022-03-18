export enum VisitStatus {
	PENDING = 'PENDING',
	APPROVED = 'APPROVED',
	DENIED = 'DENIED',
}

export interface VisitInfo {
	createdAt: string;
	endAt?: string;
	id: string;
	note: string | null;
	reason: string;
	spaceId: string;
	spaceName?: string;
	spaceAddress?: string;
	startAt?: string;
	status: VisitStatus;
	timeframe: string;
	updatedAt: string;
	userProfileId: string;
	visitorId: string;
	visitorMail: string;
	visitorName: string;
	updatedById: string;
	updatedByName: string;
}

export type VisitInfoRow = { row: { original: VisitInfo } };
