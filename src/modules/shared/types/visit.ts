export enum VisitStatus {
	PENDING = 'PENDING',
	APPROVED = 'APPROVED',
	DENIED = 'DENIED',
	CANCELLED_BY_VISITOR = 'CANCELLED_BY_VISITOR',
}

export interface Visit {
	createdAt: string;
	endAt?: string;
	id: string;
	note: string | null;
	reason?: string;
	spaceId: string;
	spaceSlug: string;
	spaceName?: string;
	spaceAddress?: string;
	spaceColor?: string;
	spaceImage?: string;
	spaceLogo?: string;
	spaceInfo?: string;
	spaceDescription?: string;
	spaceServiceDescription?: string;
	startAt?: string;
	status: VisitStatus;
	timeframe?: string;
	updatedAt: string;
	userProfileId: string;
	visitorId: string;
	visitorMail: string;
	visitorName?: string;
	updatedById: string;
	updatedByName: string;
}

export type VisitRow = { row: { original: Visit } };

export interface VisitSpaceCount {
	count: number;
	id?: string;
}

export interface VisitAccessStatus {
	spaceId: string;
	status: VisitStatus;
	visitorId: string;
}
