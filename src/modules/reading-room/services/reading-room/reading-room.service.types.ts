export interface CreateVisitRequest {
	spaceId: string;
	timeframe: string;
	reason: string;
	acceptedTos: boolean;
}

export enum AccessType {
	ACTIVE = 'ACTIVE',
	NO_ACCESS = 'NO_ACCESS',
}
