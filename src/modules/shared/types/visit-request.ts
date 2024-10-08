export enum VisitStatus {
	PENDING = 'PENDING',
	APPROVED = 'APPROVED',
	DENIED = 'DENIED',
	CANCELLED_BY_VISITOR = 'CANCELLED_BY_VISITOR',
}

export enum AccessStatus {
	PENDING = 'PENDING',
	ACCESS = 'ACCESS',
	NO_ACCESS = 'NO_ACCESS',
}

export enum AccessType {
	FULL = 'FULL',
	FOLDERS = 'FOLDERS',
}

export interface VisitRequest {
	accessibleFolderIds: string[];
	accessibleObjectIds: string[];
	createdAt: string;
	endAt?: string;
	id: string;
	note?: VisitNote;
	reason?: string;
	spaceId: string;
	spaceSlug: string;
	spaceName?: string;
	spaceMail?: string;
	spaceTelephone?: string;
	spaceColor?: string;
	spaceImage?: string;
	spaceLogo?: string;
	spaceInfo?: string;
	spaceDescriptionNl?: string;
	spaceDescriptionEn?: string;
	spaceServiceDescriptionNl?: string;
	spaceServiceDescriptionEn?: string;
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
	spaceMaintainerId: string;
	accessType: AccessType;
}

export interface VisitNote {
	authorName: string;
	createdAt: string;
	id: string;
	note: string;
}

export type VisitRow = { row: { original: VisitRequest } };

export interface VisitSpaceCount {
	count: number;
	id?: string;
}

export interface VisitAccessStatus {
	status: AccessStatus;
}
